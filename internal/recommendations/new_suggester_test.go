package recommendations

import (
	"log"
	"testing"

	"github.com/SomeSuperCoder/global-chat/models"
)

func TestBestOf(t *testing.T) {
	desired := &models.UniversalProps{
		WinRate:    10,
		TicketCost: 100,
		Frequency:  15,
		WinSize:    1000,
	}
	real := []models.UniversalProps{
		{
			WinRate:    10,
			TicketCost: 150,
			Frequency:  15,
			WinSize:    1000,
		},
		{
			WinRate:    10,
			TicketCost: 160,
			Frequency:  15,
			WinSize:    1200,
		},
	}

	res := BestOf(desired, real)
	log.Println(res)
}
