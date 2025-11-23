package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/SomeSuperCoder/global-chat/internal/parser"
)

func HandleDraws(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		parser.HandleDrawsHandle()
		return
	}

	resp, err := parser.HandleDrawsHandle()
	if err != nil {
		parser.SendError(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	parser.ForwardResponse(w, resp)
}

func HandleDraw(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		parser.SendError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Извлекаем параметры из query string
	query := r.URL.Query()
	name := query.Get("name")
	number := query.Get("number")

	resp, err := parser.HandleDrawHandle(name, number)
	if err != nil {
		parser.SendError(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer resp.Body.Close()

	parser.ForwardResponse(w, resp)
}

func HandleDrawLatest(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		parser.SendError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	name := r.URL.Query().Get("name")
	if name == "" {
		parser.SendError(w, `Missing required parameter: "name"`, http.StatusBadRequest)
		return
	}

	log.Printf("Searching for latest draw of game: %s", name)

	// 1. Получаем список игр через handleDrawsHandle
	gamesResp, err := parser.HandleDrawsHandle()
	if err != nil {
		parser.SendError(w, "Error fetching games list: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer gamesResp.Body.Close()

	// 2. Читаем весь ответ
	body, err := io.ReadAll(gamesResp.Body)
	if err != nil {
		parser.SendError(w, "Error reading games response: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// 3. Парсим JSON в map
	var result map[string]interface{}
	if err := json.Unmarshal(body, &result); err != nil {
		log.Printf("JSON parse error: %v", err)
		parser.SendError(w, "Error parsing JSON response: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// 4. Проверяем requestStatus поле вместо success
	requestStatus, ok := result["requestStatus"].(string)
	if !ok || requestStatus != "success" {
		log.Printf("API returned requestStatus not 'success': %v", result)
		parser.SendError(w, "External API returned error", http.StatusInternalServerError)
		return
	}

	// 5. Извлекаем games поле
	games, ok := result["games"]
	if !ok {
		log.Printf("Missing 'games' field in response: %v", result)
		parser.SendError(w, "Invalid API response format: missing games", http.StatusInternalServerError)
		return
	}

	// 6. Преобразуем games в массив
	gamesArray, ok := games.([]interface{})
	if !ok {
		log.Printf("Games field is not an array: %T %v", games, games)
		parser.SendError(w, "Invalid API response format: games is not array", http.StatusInternalServerError)
		return
	}

	log.Printf("Found %d games in response", len(gamesArray))

	// 7. Ищем игру по имени
	var latestNumber int
	gameFound := false

	for i, item := range gamesArray {
		game, ok := item.(map[string]interface{})
		if !ok {
			log.Printf("Item %d is not a map: %T", i, item)
			continue
		}

		gameName, ok := game["name"].(string)
		if !ok {
			log.Printf("Game %d has no name field", i)
			continue
		}

		log.Printf("Checking game: %s", gameName)

		if gameName == name {
			gameFound = true

			// Ищем последний розыгрыш - проверяем оба поля: draw и completedDraw
			var latestDraw map[string]interface{}

			// Сначала проверяем активный розыгрыш (draw)
			if draw, exists := game["draw"]; exists && draw != nil {
				if drawMap, ok := draw.(map[string]interface{}); ok {
					latestDraw = drawMap
					log.Printf("Using active draw for %s", name)
				}
			}

			// Если нет активного, используем завершенный (completedDraw)
			if latestDraw == nil {
				if completedDraw, exists := game["completedDraw"]; exists && completedDraw != nil {
					if completedDrawMap, ok := completedDraw.(map[string]interface{}); ok {
						latestDraw = completedDrawMap
						log.Printf("Using completed draw for %s", name)
					}
				}
			}

			if latestDraw == nil {
				log.Printf("Game %s has no active or completed draws", name)
				parser.SendError(w, fmt.Sprintf("No draws found for game '%s'", name), http.StatusNotFound)
				return
			}

			// Извлекаем number из найденного розыгрыша
			number, ok := latestDraw["number"]
			if !ok {
				log.Printf("Draw has no number field: %v", latestDraw)
				parser.SendError(w, "Draw has no number", http.StatusInternalServerError)
				return
			}

			// Конвертируем number в int (JSON numbers are float64)
			switch n := number.(type) {
			case float64:
				latestNumber = int(n)
			case int:
				latestNumber = n
			default:
				log.Printf("Number has unexpected type: %T %v", number, number)
				parser.SendError(w, "Invalid number format", http.StatusInternalServerError)
				return
			}

			log.Printf("Found latest draw number for %s: %d", name, latestNumber)
			break
		}
	}

	if !gameFound {
		// Собираем список доступных игр для отладки
		availableGames := make([]string, 0)
		for _, item := range gamesArray {
			if game, ok := item.(map[string]interface{}); ok {
				if gameName, ok := game["name"].(string); ok {
					availableGames = append(availableGames, gameName)
				}
			}
		}
		log.Printf("Game '%s' not found. Available games: %v", name, availableGames)
		parser.SendError(w, fmt.Sprintf("Game '%s' not found. Available games: %v", name, availableGames), http.StatusNotFound)
		return
	}

	// 8. Получаем данные розыгрыша через handleDrawHandle
	drawResp, err := parser.HandleDrawHandle(name, fmt.Sprintf("%d", latestNumber))
	if err != nil {
		parser.SendError(w, "Error fetching draw data: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer drawResp.Body.Close()

	// 9. Возвращаем данные розыгрыша
	parser.ForwardResponse(w, drawResp)
}

func HandleDrawPreLatest(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		parser.SendError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	name := r.URL.Query().Get("name")
	if name == "" {
		parser.SendError(w, `Missing required parameter: "name"`, http.StatusBadRequest)
		return
	}

	log.Printf("Searching for latest draw of game: %s", name)

	// 1. Получаем список игр через handleDrawsHandle
	gamesResp, err := parser.HandleDrawsHandle()
	if err != nil {
		parser.SendError(w, "Error fetching games list: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer gamesResp.Body.Close()

	// 2. Читаем весь ответ
	body, err := io.ReadAll(gamesResp.Body)
	if err != nil {
		parser.SendError(w, "Error reading games response: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// 3. Парсим JSON в map
	var result map[string]interface{}
	if err := json.Unmarshal(body, &result); err != nil {
		log.Printf("JSON parse error: %v", err)
		parser.SendError(w, "Error parsing JSON response: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// 4. Проверяем requestStatus поле вместо success
	requestStatus, ok := result["requestStatus"].(string)
	if !ok || requestStatus != "success" {
		log.Printf("API returned requestStatus not 'success': %v", result)
		parser.SendError(w, "External API returned error", http.StatusInternalServerError)
		return
	}

	// 5. Извлекаем games поле
	games, ok := result["games"]
	if !ok {
		log.Printf("Missing 'games' field in response: %v", result)
		parser.SendError(w, "Invalid API response format: missing games", http.StatusInternalServerError)
		return
	}

	// 6. Преобразуем games в массив
	gamesArray, ok := games.([]interface{})
	if !ok {
		log.Printf("Games field is not an array: %T %v", games, games)
		parser.SendError(w, "Invalid API response format: games is not array", http.StatusInternalServerError)
		return
	}

	log.Printf("Found %d games in response", len(gamesArray))

	// 7. Ищем игру по имени
	var latestNumber int
	gameFound := false

	for i, item := range gamesArray {
		game, ok := item.(map[string]interface{})
		if !ok {
			log.Printf("Item %d is not a map: %T", i, item)
			continue
		}

		gameName, ok := game["name"].(string)
		if !ok {
			log.Printf("Game %d has no name field", i)
			continue
		}

		log.Printf("Checking game: %s", gameName)

		if gameName == name {
			gameFound = true

			// Ищем последний розыгрыш - проверяем оба поля: draw и completedDraw
			var latestDraw map[string]interface{}

			// Сначала проверяем активный розыгрыш (draw)
			if draw, exists := game["draw"]; exists && draw != nil {
				if drawMap, ok := draw.(map[string]interface{}); ok {
					latestDraw = drawMap
					log.Printf("Using active draw for %s", name)
				}
			}

			// Если нет активного, используем завершенный (completedDraw)
			if latestDraw == nil {
				if completedDraw, exists := game["completedDraw"]; exists && completedDraw != nil {
					if completedDrawMap, ok := completedDraw.(map[string]interface{}); ok {
						latestDraw = completedDrawMap
						log.Printf("Using completed draw for %s", name)
					}
				}
			}

			if latestDraw == nil {
				log.Printf("Game %s has no active or completed draws", name)
				parser.SendError(w, fmt.Sprintf("No draws found for game '%s'", name), http.StatusNotFound)
				return
			}

			// Извлекаем number из найденного розыгрыша
			number, ok := latestDraw["number"]
			if !ok {
				log.Printf("Draw has no number field: %v", latestDraw)
				parser.SendError(w, "Draw has no number", http.StatusInternalServerError)
				return
			}

			// Конвертируем number в int (JSON numbers are float64)
			switch n := number.(type) {
			case float64:
				latestNumber = int(n)
			case int:
				latestNumber = n
			default:
				log.Printf("Number has unexpected type: %T %v", number, number)
				parser.SendError(w, "Invalid number format", http.StatusInternalServerError)
				return
			}

			log.Printf("Found latest draw number for %s: %d", name, latestNumber)
			break
		}
	}

	if !gameFound {
		// Собираем список доступных игр для отладки
		availableGames := make([]string, 0)
		for _, item := range gamesArray {
			if game, ok := item.(map[string]interface{}); ok {
				if gameName, ok := game["name"].(string); ok {
					availableGames = append(availableGames, gameName)
				}
			}
		}
		log.Printf("Game '%s' not found. Available games: %v", name, availableGames)
		parser.SendError(w, fmt.Sprintf("Game '%s' not found. Available games: %v", name, availableGames), http.StatusNotFound)
		return
	}

	// 8. Получаем данные розыгрыша через handleDrawHandle
	drawResp, err := parser.HandleDrawHandle(name, fmt.Sprintf("%d", latestNumber-1))
	if err != nil {
		parser.SendError(w, "Error fetching draw data: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer drawResp.Body.Close()

	// 9. Возвращаем данные розыгрыша
	parser.ForwardResponse(w, drawResp)
}

func HandleMomentalCards(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		parser.SendError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	resp, err := parser.HandleMomentalHandle()
	if err != nil {
		parser.SendError(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	parser.ForwardResponse(w, resp)
}
