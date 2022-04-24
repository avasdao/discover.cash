# Discover Cash API

### https://api.discover.cash (v1)

## Endpoints

### Merchants (all)

`/v1/merchants`

eg. https://api.discover.cash/v1/merchants


## VPS Configuration

__[Nginx](https://nginx.org/en/)__ is being used as the reverse proxy for the API server.

### Elasticsearch

https://www.elastic.co/

```
{
  "name" : "satoshi",
  "cluster_name" : "elasticsearch",
  "cluster_uuid" : "zHY2NI5MRxa7c6dBJcRf8g",
  "version" : {
    "number" : "7.11.0",
    "build_flavor" : "default",
    "build_type" : "deb",
    "build_hash" : "8ced7813d6f16d2ef30792e2fcde3e755795ee04",
    "build_date" : "2021-02-08T22:44:01.320463Z",
    "build_snapshot" : false,
    "lucene_version" : "8.7.0",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "You Know, for Search"
}
```

### Merchants

- Identifier
- Merchant ID
- Status
- Map.Bitcoin.com Status
- Company Name
- Merchant Category
- Merchant Type
- Contact Person
- Merchant Contact Person Role
- Email (from Person)
- Mobile Phone (from Person)
- Merchant Email
- Mobile Phone
- Other Phone
- Street Address 1
- Street Address 2
- Neighborhood
- City
- State
- Country
- Postal Code
- Onboarding Date
- Onboarder
- Email (from Onboarder)
- Instagram
- Twitter
- Facebook
- Google Business
- Website
- Local.bitcoin.com Profile
- BCH Address
- Merchant Storefront Photo
- Merchant Logos Photo
- Merchant Sticker Photo
- Merchant Why
- Onboarder Notes
- Verifier
- Verification Method
- Verification Evidence
- Verifier Notes
- Identifier (from Franchise/Branch?)
- Merchant Summary Text
- Merchant Logo
- License
- Date Sticker Sent (Self-Onboard)
