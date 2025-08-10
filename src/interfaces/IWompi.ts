export interface WompiPayoutEvent {
  event: string
  data: Data
  sent_at: string
  timestamp: number
  signature: Signature
  environment: string
}

export interface Data {
  transaction: Transaction
}

export interface Transaction {
  id: string
  created_at: string
  finalized_at: string
  amount_in_cents: number
  reference: string
  customer_email: string
  currency: string
  payment_method_type: string
  payment_method: PaymentMethod
  status: string
  status_message: any
  shipping_address: any
  redirect_url: string
  payment_source_id: any
  payment_link_id: string
  customer_data: CustomerData
  billing_data: any
  origin: any
}

export interface PaymentMethod {
  type: string
  extra: Extra
  phone_number: string
}

export interface Extra {
  is_three_ds: boolean
  transaction_id: string
  three_ds_auth_type: any
  external_identifier: string
}

export interface CustomerData {
  legal_id: string
  device_id: string
  full_name: string
  browser_info: BrowserInfo
  phone_number: string
  legal_id_type: string
  device_data_token: string
  customer_references: CustomerReference[]
}

export interface BrowserInfo {
  browser_tz: string
  browser_language: string
  browser_user_agent: string
  browser_color_depth: string
  browser_screen_width: string
  browser_screen_height: string
}

export interface CustomerReference {
  label: string
  value: string
}

export interface Signature {
  checksum: string
  properties: string[]
}
