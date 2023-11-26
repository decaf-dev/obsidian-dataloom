import "./styles.css";

interface Props {
	children: React.ReactNode;
}

export default function SourceItem({ children }: Props) {
	return <div className="dataloom-source-item">{children}</div>;
}
