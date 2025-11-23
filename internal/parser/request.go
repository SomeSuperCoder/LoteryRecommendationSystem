package parser

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

const (
	baseURL      = "https://www.stoloto.ru/p/api/mobile/api/v35"
	partnerToken = "bXMjXFRXZ3coWXh6R3s1NTdUX3dnWlBMLUxmdg"
	userAgent    = "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15"
	// cookie       = "_ym_uid=1763713185857485651; _ym_d=1763713185; advcake_track_id=d63cf80d-277f-36d5-cc77-47c09b2a030c; advcake_track_url=%3D20250113K81DHewilQ6elE6VYFaTiyDbY6j2bIN36edPk99XcDQnfsg%2BVJVfuNLU3ImQi0VGutiS2R0xbn8PeMO1%2FHyWoWajNkQM5ZcInz0ySNRH4Cim0NcBlXx0MY5RK%2B9iU9pUYx3QSVNtILZB0JLGf8D7LbYqHFkm2u%2BxfSbMLz87R8oC8BdUd%2FwSlqaVoA7ETViX8ACb6EB2htExrQ2BsYMdkRFfuDKwInXAQht7nJiP5D6I%2Bj0xq3OogzSDjM%2FIfuumcUJekP68kBkudv2w7WVxJ6DF1PE6bBBf9%2BMyaoS3LkurSZdCyBoHY%2F7%2F31%2B2JWYkd1orQsWqEvb2Xm6uiMqD%2BrGxK5FR64R%2BonL…qAqnLbOX7vyfSDrvgmQvQi05%2BM7lVajf4%2FZ2DufjY%2BtRUClhZgKbTzqc3me6w2C%2FQTGVYRB1p%2Bqo1plK5p%2Fzc5rGACIZYwW5mtzX61NvtXdZ%2Br5ad9cvacHC0Z57cl5yZLlzmo0I4dQmevkr%2BEu5feVentewowtvZxh1xxouZlon5FYt3pPdTc65nB9HaPy%2Fjcoq3LvkgAOuUdZda1jTV1%2BslKUdzoxW%2F45WYog%3D; advcake_session_id=bd6cfd6a-7e39-a637-0dd0-f0066198ada4; bh=YNeXickGahLcyumIDvKso64Ek5jyjgOUhAI=; uxs_uid=d90e3270-c6b2-11f0-854f-ff5d4df1ed6c; _yasc=KXaoUaYgliahE476auPl7yoYL713IYGCMOenq/tJIpx0HNQB1oxrY44jCeHTz7uc; isgua=false; _ym_isad=1; _ym_visorc=b"
)

func MakeAPIRequest(endpoint string) (*http.Response, error) {
	req, err := http.NewRequest("GET", baseURL+endpoint, nil)
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

func SendError(w http.ResponseWriter, message string, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"error":   message,
		"success": false,
	})
}

func SetHeaders(req *http.Request) {
	req.Header.Set("Gosloto-Partner", partnerToken)
	req.Header.Set("User-Agent", userAgent)
	req.Header.Set("Accept", "application/json")
	// req.Header.Set("Cookie", cookie)

}

func ForwardResponse(w http.ResponseWriter, resp *http.Response) {
	for key, values := range resp.Header {
		for _, value := range values {
			w.Header().Add(key, value)
		}
	}

	w.WriteHeader(resp.StatusCode)
	io.Copy(w, resp.Body)
}
