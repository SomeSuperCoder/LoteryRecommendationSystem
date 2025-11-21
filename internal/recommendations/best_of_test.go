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
		WinRateK: 90,
	}
	// ERROR: EVERTHING IS WRONG YOU ARE MULTIPLIYING THE WRONG NUMBER
	// NOTE: it is better to divide

	DefaultKs(desiredWithKs)
	desired := desiredWithKs.AsUniversalProps()

	real := []models.UniversalProps{
		{
			WinRate:    10,
			TicketCost: 150,
			Frequency:  15,
			WinSize:    1000,
		},
		{
			WinRate:    19,
			TicketCost: 160,
			Frequency:  15,
			WinSize:    1200,
		},
	}

	res := BestOf(desired, real)
	log.Println(res)
}
