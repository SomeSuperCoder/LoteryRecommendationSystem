package recommendations

import (
	"log"
	"testing"

	"github.com/SomeSuperCoder/global-chat/models"
)

func TestBestOf(t *testing.T) {
	desiredWithKs := &models.UniversalPropsWithK{
		UniversalProps: models.UniversalProps{
			WinRate:    10,
			TicketCost: 100,
			Frequency:  20,
			WinSize:    1000,
		},
	}

	DefaultKs(desiredWithKs)

	real := []models.UniversalProps{
		{
			WinRate:    5,
			TicketCost: 50,
			Frequency:  10,
			WinSize:    500,
		},
		{
			WinRate:    15,
			TicketCost: 150,
			Frequency:  30,
			WinSize:    1500,
		},
	}

	res := BestOf(desiredWithKs, real)
	log.Println(res)
}
