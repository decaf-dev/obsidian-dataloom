import { SourceType } from "src/shared/loom-state/types/loom-state";

export type SourceAddHandler = (type: SourceType, name: string) => void;

export type FrontMatterType = "text" | "number" | "boolean" | "array" | "tags";
