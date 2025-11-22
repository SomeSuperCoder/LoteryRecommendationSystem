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
			Frequency:  15,
			WinSize:    1000,
		},
		WinRateK: 1,
	}

	DefaultKs(desiredWithKs)

	real := []models.UniversalProps{
		{
			WinRate:    10,
			TicketCost: 150,
			Frequency:  15,
			WinSize:    1000,
		},
		{
			WinRate:    11,
			TicketCost: 160,
			Frequency:  15,
			WinSize:    1000,
		},
	}

	res := BestOf(desiredWithKs, real)
	log.Println(res)
}
