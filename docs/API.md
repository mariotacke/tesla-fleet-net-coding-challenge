# API
- [Rollouts](#rollouts)
  - [Create Rollout](#create-rollout)
  - [Get Rollout](#get-rollout)
- [Jobs](#jobs)
  - [Create Job](#create-job)
  - [Get Job](#get-job)
  - [Update Job Status](#update-job-status)
  - [Cancel Job](#cancel-job)
  - [Get Job Status History](#get-job-status-history)

## Rollouts

### Create Rollout
Creates a new `Rollout` without any `Job`s.

#### Request
- `POST /rollouts`

#### Body
```json
{
  "rollout_name": "<new-rollout-name>"
}
```

#### Success Response (example)
```json
HTTP/1.1 201 Created
{
  "name": "Rollout1",
  "createdAt": "2017-02-24T04:48:26.023Z",
  "jobs": []
}
```

#### Failure Response (example)
```json
HTTP/1.1 409 Conflict
{
  "message": "Rollout 'Rollout1' already exists."
}
```

### Failure Response (example)
```json
HTTP/1.1 400 Bad Request
{
  "code": "validation_failed",
  "errors": [
    {
      "field": "rollout_name",
      "code": "cannot_be_blank"
    }
  ]
}
```

### Get Rollout
Gets a `Rollout` by name. This request can optionally be summarized.

#### Requests
- `GET /rollouts/:rollout_name`
- `GET /rollouts/:rollout_name?summary=true`

#### Parameters
- `:rollout_name`: Name of the `Rollout` to query.
- `summary`: (optional) Summary flag. If set, the response is summarized.

#### Success Response (example)
- `GET /rollouts/Rollout1`
```json
HTTP/1.1 200 OK
{
  "name": "Rollout1",
  "createdAt": "2017-02-24T04:48:26.023Z",
  "jobs": []
}
```

#### Success Summary Response (example)
- `GET /rollouts/Rollout1?summary=true`
```json
HTTP/1.1 200 OK
{
  "name": "Rollout1",
  "summary": {
    "created": 2,
    "downloading": 4,
    "installing": 3,
    "succeeded": 10,
    "failed": 1,
    "canceled": 1
  }
}
```

## Jobs

### Create Job
Creates a new `Job`.

#### Request
- `POST /jobs`

#### Body
```json
{
  "rollout_name": "<existing-rollout-name>",
  "job_name": "<new-job-name>",
  "vehicle_name": "<vehicle-name>",
  "version": "<version>"
}
```

#### Success Response (example)
```json
HTTP/1.1 201 Created
{
  "name": "Job1",
  "vehicle": "Vehicle1",
  "version": 1,
  "createdAt": "2017-02-24T04:48:28.525Z",
  "statusHistory": [
    {
      "type": "created",
      "createdAt": "2017-02-24T04:48:28.525Z"
    }
  ],
  "status": "created"
}
```

#### Failure Response (example)
```json
HTTP/1.1 409 Conflict
{
  "message": "Job 'Job1' already exists in Rollout 'Rollout1'"
}
```

### Failure Response (example)
```json
HTTP/1.1 400 Bad Request
{
  "code": "validation_failed",
  "errors": [
    {
      "field": "rollout_name",
      "code": "cannot_be_blank"
    },
    {
      "field": "vehicle_name",
      "code": "cannot_be_blank"
    },
    {
      "field": "job_name",
      "code": "cannot_be_blank"
    },
    {
      "field": "version",
      "code": "cannot_be_blank"
    }
  ]
}
```

### Get Job
Gets a `Job` by name.

#### Request
- `GET /jobs/:job_name`

#### Parameters
- `:job_name`: Name of the `Job` to query.

#### Success Response (example)
- `GET /jobs/Job1`
```json
HTTP/1.1 200 OK
{
  "name": "Job1",
  "vehicle": "Vehicle1",
  "version": 1,
  "createdAt": "2017-02-24T05:24:25.451Z",
  "statusHistory": [
    {
      "type": "created",
      "createdAt": "2017-02-24T05:24:25.451Z"
    }
  ],
  "status": "created"
}
```

### Update Job Status
Updates the `Job` status to the provided status value.

#### Request
- `PUT /jobs/:job_name?status=:status`

#### Parameters
- `:job_name`: Name of the `Job` to update.
- `:status`: New status of the `Job`. Must be either `downloading`, `installing`, `succeeded`, or `failed`.

#### Success Response (example)
- `PUT /jobs/Job1?status=downloading`
```json
HTTP/1.1 200 OK
{
  "name": "Job1",
  "vehicle": "Vehicle1",
  "version": 1,
  "createdAt": "2017-02-24T05:24:25.451Z",
  "statusHistory": [
    {
      "type": "created",
      "createdAt": "2017-02-24T05:24:25.451Z"
    },
    {
      "type": "downloading",
      "createdAt": "2017-02-24T05:28:14.169Z"
    }
  ],
  "status": "downloading"
}
```

#### Failure Response (example)
- `PUT /jobs/Job1?status=canceled`
```json
HTTP/1.1 400 Bad Request
{
  "code": "validation_failed",
  "errors": [
    {
      "field": "status",
      "code": "invalid_status"
    }
  ]
}
```

### Cancel Job
Cancels a `Job`. The status of the `Job` changes to `canceled`. You can only cancel a `Job` if its current status is either `created` or `downloading`.

#### Request
- `DELETE /jobs/:job_name`

#### Parameters
- `:job_name`: Name of the `Job` to cancel.

#### Success Response (example)
- `DELETE /job/Job1`
```json
HTTP/1.1 200 OK
{
  "name": "Job1",
  "vehicle": "Vehicle1",
  "version": 1,
  "createdAt": "2017-02-24T04:48:28.525Z",
  "statusHistory": [
    {
      "type": "created",
      "createdAt": "2017-02-24T04:48:28.525Z"
    },
    {
      "type": "downloading",
      "createdAt": "2017-02-24T04:48:31.208Z"
    },
    {
      "type": "canceled",
      "createdAt": "2017-02-24T04:48:35.392Z"
    }
  ],
  "status": "canceled"
}
```

### Get Job Status History
Gets only a `Job` name and its statuses.

#### Request
- `GET /jobs/:job_name/history`

#### Parameters
- `:job_name`: Name of the `Job` to query.

#### Success Response (example)
- `GET /jobs/Job1/history`
```json
HTTP/1.1 200 OK
{
  "name": "Job1",
  "statusHistory": [
    {
      "type": "created",
      "createdAt": "2017-02-24T05:24:25.451Z"
    },
    {
      "type": "downloading",
      "createdAt": "2017-02-24T05:28:14.169Z"
    }
  ]
}
```

#### Failure Response (example)
- `GET /jobs/UnknownJob/history`
```json
HTTP/1.1 409 Conflict
{
  "message": "Job 'UnknownJob' not found."
}
```
