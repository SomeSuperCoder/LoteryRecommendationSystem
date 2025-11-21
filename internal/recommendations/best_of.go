package recommendations

import (
	"sort"

	"github.com/SomeSuperCoder/global-chat/models"
)

// TODO: pass in k
func BestOf(desired *models.UniversalProps, realValues []models.UniversalProps) []models.UniversalPropsWithCalcualtedDiff {
	processed := make([]models.UniversalPropsWithCalcualtedDiff, len(realValues))

	for i, real := range realValues {
		// Normalize all fields
		diffed := &models.DiffedUniversalProps{}

		diffed.Frequency = +DiffPercentage(desired.Frequency, real.Frequency)
		diffed.TicketCost = -DiffPercentage(desired.TicketCost, real.TicketCost)
		diffed.WinRate = +DiffPercentage(desired.WinRate, real.WinRate)
		diffed.WinSize = +DiffPercentage(desired.WinSize, real.WinSize)

		// Diff sum
		diffSum := diffed.Frequency + diffed.TicketCost + diffed.WinRate + diffed.WinSize

		// Convert into a wrapped type and add into the processed array
		processed[i] = models.UniversalPropsWithCalcualtedDiff{
			Diff:           diffSum,
			UniversalProps: real,
		}
	}

	// The less the better
	// TODO: ask if there will be a problem
	sort.Slice(processed, func(i, j int) bool {
		if processed[i].Diff != processed[j].Diff {
			return processed[i].Diff > processed[j].Diff
		}
		return processed[i].Diff < processed[j].Diff
	})

	return processed
}

// d - desired
// r - real
func DiffPercentage(d int, r int) float64 {
	return float64(r-d) / float64(d)
}
