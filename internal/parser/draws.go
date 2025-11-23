package parser

import (
	"fmt"
	"net/http"
	"time"
)

func HandleDrawsHandle() (*http.Response, error) {
	resp, err := MakeAPIRequest("/service/games/info-new")
	if err != nil {
		return nil, fmt.Errorf("error making API request: %w", err)
	}

	return resp, nil
}

func HandleDrawHandle(name, number string) (*http.Response, error) {
	if name == "" || number == "" {
		return nil, fmt.Errorf(`missing required parameters: "name" and "number"`)
	}

	url := fmt.Sprintf("/service/draws/%s/%s", name, number)
	resp, err := MakeAPIRequest(url)
	if err != nil {
		return nil, fmt.Errorf("error making API request: %w", err)
	}

	return resp, nil
}

func HandleMomentalHandle() (*http.Response, error) {
	resp, err := makeMomentalrequest("https://api.stoloto.ru/cms/api/moment-cards-section?platform=OS&user-segment=ALL")
	if err != nil {
		return nil, fmt.Errorf("error making API request: %w", err)
	}

	return resp, nil
}

func makeMomentalrequest(endpoint string) (*http.Response, error) {
	req, err := http.NewRequest("GET", endpoint, nil)
	if err != nil {
		return nil, fmt.Errorf("error creating request: %w", err)
	}

	SetHeaders(req)

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error making request: %w", err)
	}

	return resp, nil
}
