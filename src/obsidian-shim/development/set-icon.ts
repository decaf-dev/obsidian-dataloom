import {
	createElement,
	X,
	ArrowLeft,
	Plus,
	Search,
	Trash2,
	GripVertical,
	GripHorizontal,
	Text,
	Banknote,
	Calendar,
	CheckSquare,
	Clock2,
	Hash,
	Link,
	Tag,
	Tags,
	File,
	Settings,
	ArrowUp,
	ArrowDown,
	Trash,
	List,
} from "lucide";

const findIcon = (name: string) => {
	switch (name) {
		case "x":
			return X;
		case "arrow-left":
			return ArrowLeft;
		case "plus":
			return Plus;
		case "search":
			return Search;
		case "trash-2":
			return Trash2;
		case "grip-vertical":
			return GripVertical;
		case "grip-horizontal":
			return GripHorizontal;
		case "text":
			return Text;
		case "link":
			return Link;
		case "file":
			return File;
		case "hash":
			return Hash;
		case "check-square":
			return CheckSquare;
		case "clock-2":
			return Clock2;
		case "tag":
			return Tag;
		case "tags":
			return Tags;
		case "calendar":
			return Calendar;
		case "banknote":
			return Banknote;
		case "settings":
			return Settings;
		case "arrow-up":
			return ArrowUp;
		case "arrow-down":
			return ArrowDown;
		case "trash":
			return Trash;
		case "list":
			return List;
		default:
			return null;
	}
};

export const setIcon = (div: HTMLElement, name: string) => {
	const icon = findIcon(name);
	if (!icon) return;
	const iconEl = createElement(icon);
	iconEl.setAttribute("width", "18px");
	iconEl.setAttribute("height", "18px");
	iconEl.setAttribute("stroke-width", "var(--icon-stroke)");
	iconEl.setAttribute("stroke", "var(--text-normal)");
	div.appendChild(iconEl);
};
