# Additional Considerations
The example coding challenge provides a basic look at a possible proof-of-concept API service. The following is a list of considerations when building a production ready version.

- Use UUID v4s as identifiers for all entities.
  - This prevents name collisions.
  - Uniform data type for queries.
- Consider sending `rolloutId` with every request.
  - `Job`s are children to `Rollout`s.
  - It makes the lookup in a real database quicker by partitioning the set early.
  - Could be sent in a header such as `X-Tesla-Rollout-Id`
- Use token based authentication
  - JWTs for performance optimized authorization. No database lookups necessary.
