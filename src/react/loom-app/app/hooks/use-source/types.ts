import { SourceType } from "src/shared/loom-state/types/loom-state";

export type SourceAddHandler = (type: SourceType, name: string) => void;
