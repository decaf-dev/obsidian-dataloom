import {
	GeneralCalculation,
	NumberCalculation,
} from "../shared/loom-state/types/loom-state";
import type { CalculationType } from "./types";

export interface CalculationOption {
	name: string;
	shortName: string;
	value: CalculationType;
	ariaLabel: string;
}

export const calculationOptions: CalculationOption[] = [
	{
		name: "Count all",
		shortName: "Count",
		value: GeneralCalculation.COUNT_ALL,
		ariaLabel: "Counts the total number of rows",
	},
	{
		name: "Count not empty",
		shortName: "Not empty",
		value: GeneralCalculation.COUNT_NOT_EMPTY,
		ariaLabel: "Counts the number of rows with a non-empty cell value",
	},
	{
		name: "Count values",
		shortName: "Values",
		value: GeneralCalculation.COUNT_VALUES,
		ariaLabel: "Counts the number of values in the column",
	},
	{
		name: "Count empty",
		shortName: "Empty",
		value: GeneralCalculation.COUNT_EMPTY,
		ariaLabel: "Counts the number of rows with an empty cell value",
	},
	{
		name: "Count unique",
		shortName: "Unique",
		value: GeneralCalculation.COUNT_UNIQUE,
		ariaLabel: "Counts the number of unique values in the column",
	},
	{
		name: "None",
		shortName: "None",
		value: GeneralCalculation.NONE,
		ariaLabel: "No calculation",
	},
	{
		name: "Percent empty",
		shortName: "Empty",
		value: GeneralCalculation.PERCENT_EMPTY,
		ariaLabel: "Displays the percentage of rows with an empty cell value",
	},
	{
		name: "Percent not empty",
		shortName: "Not empty",
		value: GeneralCalculation.PERCENT_NOT_EMPTY,
		ariaLabel:
			"Displays the percentage of rows with a non-empty cell value",
	},
	{
		name: "Sum",
		shortName: "Sum",
		value: NumberCalculation.SUM,
		ariaLabel: "Computes the sum of the cells in the column",
	},
	{
		name: "Average",
		shortName: "Avg",
		value: NumberCalculation.AVG,
		ariaLabel: "Computes the average of the cells in the column",
	},
	{
		name: "Minimum",
		shortName: "Min",
		value: NumberCalculation.MIN,
		ariaLabel: "Computes the minimum of the cells in the column",
	},
	{
		name: "Maximum",
		shortName: "Max",
		value: NumberCalculation.MAX,
		ariaLabel: "Computes the maximum of the cells in the column",
	},
	{
		name: "Median",
		shortName: "Median",
		value: NumberCalculation.MEDIAN,
		ariaLabel: "Computes the median of the cells in the column",
	},
	{
		name: "Range",
		shortName: "Range",
		value: NumberCalculation.RANGE,
		ariaLabel: "Computes the range (max - min) of the cells in the column",
	},
];
