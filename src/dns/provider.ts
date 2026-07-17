export interface Zone {
  id: string;
  domain: string;
}

export interface RecordInput {
  name: string;
  type: string;
  value: string;
  line_id?: string;
}

export interface DNSRecord {
  remote_id: string;
  name: string;
  type: string;
  value: string;
  line_id: string;
  line: string;
}

export interface RecordLine {
  id: string;
  name: string;
}

export interface ConfigField {
  name: string;
  label: string;
  required: boolean;
  secret: boolean;
  description?: string;
}

export interface Provider {
  key(): string;
  label(): string;
  configFields(): ConfigField[];
  configure(config: Record<string, string>): void;
  check(): Promise<void>;
  listZones(): Promise<Zone[]>;
  listRecordLines(zone: Zone): Promise<RecordLine[]>;
  createRecord(zone: Zone, input: RecordInput): Promise<DNSRecord>;
  updateRecord(zone: Zone, remoteId: string, input: RecordInput): Promise<DNSRecord>;
  deleteRecord(zone: Zone, remoteId: string): Promise<void>;
  getRecord(zone: Zone, remoteId: string): Promise<DNSRecord>;
  listRecords(zone: Zone): Promise<DNSRecord[]>;
}

export type ProviderFactory = () => Provider;

const registry = new Map<string, ProviderFactory>();

export function registerProvider(key: string, factory: ProviderFactory): void {
  registry.set(key, factory);
}

export function getProvider(key: string): Provider | null {
  const factory = registry.get(key);
  return factory ? factory() : null;
}

export function getRegisteredKeys(): string[] {
  return Array.from(registry.keys()).sort();
}
