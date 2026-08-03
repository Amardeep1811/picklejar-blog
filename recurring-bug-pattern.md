# Recurring Bug Patterns

- **Lost JSON-LD structured data on PostPage**: A previously-verified, tested feature (JSON-LD BlogPosting schema) was silently lost during an unrelated refactor (the Helmet duplication fix). It is worth building a habit of re-checking previously-passing verifications after any structural change to a shared component, not just the specific bug being fixed. Date: 2024-08-04 (or current date).
