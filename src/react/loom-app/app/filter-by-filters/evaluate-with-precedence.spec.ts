import { evaluateWithPrecedence, Expression } from "./evaluate-with-precedence";

describe("evaluateByPrecedance", () => {
	it("true && true === true", () => {
		const expressions: Expression[] = [
			{
				operator: "or",
				value: true,
			},
			{
				operator: "and",
				value: true,
			},
		];
		const result = evaluateWithPrecedence(expressions);
		expect(result).toBe(true);
	});

	it("true && false === false", () => {
		const expressions: Expression[] = [
			{
				operator: "or",
				value: true,
			},
			{
				operator: "and",
				value: false,
			},
		];
		const result = evaluateWithPrecedence(expressions);
		expect(result).toBe(false);
	});

	it("false && true === false", () => {
		const expressions: Expression[] = [
			{
				operator: "or",
				value: false,
			},
			{
				operator: "and",
				value: true,
			},
		];
		const result = evaluateWithPrecedence(expressions);
		expect(result).toBe(false);
	});

	it("false && false === false", () => {
		const expressions: Expression[] = [
			{
				operator: "or",
				value: false,
			},
			{
				operator: "and",
				value: false,
			},
		];
		const result = evaluateWithPrecedence(expressions);
		expect(result).toBe(false);
	});

	it("true || true === true", () => {
		const expressions: Expression[] = [
			{
				operator: "or",
				value: true,
			},
			{
				operator: "or",
				value: true,
			},
		];
		const result = evaluateWithPrecedence(expressions);
		expect(result).toBe(true);
	});

	it("true || false === true", () => {
		const expressions: Expression[] = [
			{
				operator: "or",
				value: true,
			},
			{
				operator: "or",
				value: false,
			},
		];
		const result = evaluateWithPrecedence(expressions);
		expect(result).toBe(true);
	});

	it("false || true === true", () => {
		const expressions: Expression[] = [
			{
				operator: "or",
				value: false,
			},
			{
				operator: "or",
				value: true,
			},
		];
		const result = evaluateWithPrecedence(expressions);
		expect(result).toBe(true);
	});

	it("false || false === false", () => {
		const expressions: Expression[] = [
			{
				operator: "or",
				value: false,
			},
			{
				operator: "or",
				value: false,
			},
		];
		const result = evaluateWithPrecedence(expressions);
		expect(result).toBe(false);
	});

	it("true || false && true === true", () => {
		const expressions: Expression[] = [
			{
				operator: "or",
				value: true,
			},
			{
				operator: "or",
				value: false,
			},
			{
				operator: "and",
				value: true,
			},
		];
		const result = evaluateWithPrecedence(expressions);
		expect(result).toBe(true);
	});

	it("true && false || true === true", () => {
		const expressions: Expression[] = [
			{
				operator: "or",
				value: true,
			},
			{
				operator: "and",
				value: false,
			},
			{
				operator: "or",
				value: true,
			},
		];
		const result = evaluateWithPrecedence(expressions);
		expect(result).toBe(true);
	});
});
