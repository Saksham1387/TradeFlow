import {
  SUPPORTED_ASSESTS,
  type ActionCredentials,
  type GmailActionMetadata,
  type GmailCredentials,
  type PriceTriggerNodeMetadata,
  type TimerTriggerNodeMetadata,
  type TradingMetadata,
} from "../metadata";

export type FieldDescriptor =
  | { type: "number"; key: string; label: string; placeholder?: string }
  | { type: "string"; key: string; label: string; placeholder?: string }
  | { type: "select"; key: string; label: string; options: string[] };

export type TriggerDefinition<T> = {
  id: string;
  title: string;
  description: string;
  defaultMetadata: T;
  fields: FieldDescriptor[];
};

export type EdgeDocument = {
  source: string;
  id: string;
  target: string;
};
export type AnyTriggerDefinition =
  | TriggerDefinition<TimerTriggerNodeMetadata>
  | TriggerDefinition<PriceTriggerNodeMetadata>;

export const SUPPORTED_TRIGGERS: AnyTriggerDefinition[] = [
  {
    id: "timer-trigger",
    title: "Timer",
    description: "Run this every x seconds",
    defaultMetadata: { time: 3600 } satisfies TimerTriggerNodeMetadata,
    fields: [
      {
        type: "number",
        key: "time",
        label: "Interval (seconds)",
        placeholder: "e.g. 3600",
      },
    ],
  },
  {
    id: "price-trigger",
    title: "Price Trigger",
    description: "Run this when the price is an exact amount",
    defaultMetadata: {
      assest: SUPPORTED_ASSESTS[0]!,
      amount: 0,
    } satisfies PriceTriggerNodeMetadata,
    fields: [
      {
        type: "select",
        key: "assest",
        label: "Asset",
        options: SUPPORTED_ASSESTS,
      },
      {
        type: "number",
        key: "amount",
        label: "Target Price",
        placeholder: "e.g. 50000",
      },
    ],
  },
];

export type CredentialDescriptor =
  | { type: "field"; key: keyof ActionCredentials; label: string; placeholder?: string }
  | { type: "oauth"; provider: "google"; scopes: string[] };

export type ActionDefinition<T,C = ActionCredentials | GmailCredentials> = {
  id: string;
  title: string;
  description: string;
  defaultMetadata: T;
  defaultCredentials: C;
  fields: FieldDescriptor[];
  credentials?: CredentialDescriptor[];
};

export type AnyActionDefinition = ActionDefinition<
  TradingMetadata | GmailActionMetadata
>;

const DEFAULT_TRADING_METADATA: TradingMetadata = {
  type: "LONG",
  qty: 0,
  symbol: SUPPORTED_ASSESTS as unknown as typeof SUPPORTED_ASSESTS,
};

const DEFAULT_GMAIL_NODE_METADATA: GmailActionMetadata = {
  content: "",
  subject: "",
  sendTo:""
};

const DEFAULT_CREDENTIALS: ActionCredentials = { apiKey: "" };

const TRADING_FIELDS: FieldDescriptor[] = [
  { type: "select", key: "symbol", label: "Asset", options: SUPPORTED_ASSESTS },
  {
    type: "number",
    key: "qty",
    label: "Quantity",
    placeholder: "Enter quantity",
  },
  {
    type: "select",
    key: "type",
    label: "Direction",
    options: ["LONG", "SHORT"],
  },
];


const GMAIL_ACTION_FIELDS: FieldDescriptor[] = [
  {
    type: "string",
    key: "subject",
    label: "Subject",
    placeholder: "Enter the Subject",
  },
  {
    type: "string",
    key: "content",
    label: "Content",
    placeholder: "Enter the content of the email",
  },
  {
    type: "string",
    key: "sendTo",
    label: "Send To",
    placeholder: "Enter the email to send to",
  }
]

const API_KEY_CREDENTIAL: CredentialDescriptor[] = [
  { type:"field", key: "apiKey", label: "API Key", placeholder: "Enter your API key" },
];

export const SUPPORTED_ACTIONS: AnyActionDefinition[] = [
  {
    id: "lighter",
    title: "Lighter",
    description: "Place a trade on Lighter",
    defaultMetadata: DEFAULT_TRADING_METADATA,
    defaultCredentials: DEFAULT_CREDENTIALS,
    fields: TRADING_FIELDS,
    credentials: API_KEY_CREDENTIAL,
  },
  {
    id: "gmail-action",
    title: "Gmail",
    description: "Send Email to a specific email",
    defaultMetadata: DEFAULT_GMAIL_NODE_METADATA,
    fields: GMAIL_ACTION_FIELDS,
    defaultCredentials: { accessToken: "", refreshToken: "" } satisfies GmailCredentials,
    credentials: [{ type: "oauth", provider: "google", scopes: ["https://www.googleapis.com/auth/gmail.send"] }],
  },
  {
    id: "hyper-liquid",
    title: "Hyper Liquid",
    description: "Place a trade on Hyper Liquid",
    defaultMetadata: DEFAULT_TRADING_METADATA,
    defaultCredentials: DEFAULT_CREDENTIALS,
    fields: TRADING_FIELDS,
  },
  {
    id: "backpack",
    title: "Backpack",
    description: "Place a trade on Backpack",
    defaultMetadata: DEFAULT_TRADING_METADATA,
    defaultCredentials: DEFAULT_CREDENTIALS,
    fields: TRADING_FIELDS,
    credentials: API_KEY_CREDENTIAL,
  },
];
