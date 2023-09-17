export default abstract class MigrateState {
	public abstract migrate(prevState: unknown): unknown;
}
