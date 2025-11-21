package recommendations

import (
	"github.com/SomeSuperCoder/global-chat/models"
)

func BestOf(ideal models.UniversalProps, givenList []models.UniversalProps) {
	for _, agiven := range givenList {
		// Normalize all fields
		normalized := &models.NormalizedUniversalProps{}

		normalized.Frequency = float64(agiven.Frequency) / float64(ideal.Frequency)
		normalized.TicketCost = float64(agiven.TicketCost) / float64(ideal.TicketCost)
		normalized.WinRate = float64(agiven.WinRate) / float64(ideal.WinRate)
		normalized.WinSize = float64(agiven.WinSize) / float64(ideal.WinSize)

		// Compare

	}
}

// d - desired
// r - real
func DiffPercentage(d int, r int) float64 {
	return float64(r-d) / float64(d)
}
