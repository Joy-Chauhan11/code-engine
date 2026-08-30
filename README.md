# CodeEngine

A lightweight, Docker-based code execution and judging engine for safely executing user-submitted programs within isolated containers.

CodeEngine provides a REST API for executing arbitrary source code across multiple programming languages, capturing output streams, enforcing resource and time constraints, and evaluating submissions against predefined test cases.

---

## Overview

Executing untrusted, user-submitted code introduces significant security and stability risks, including infinite loops, excessive resource consumption, and unauthorized system access. CodeEngine addresses these risks by isolating each execution within a dedicated, ephemeral Docker container with strict CPU, memory, and time constraints.

The service is designed to be embedded behind larger applications — online judges, coding-assessment platforms, or interactive learning tools — that require a reliable, sandboxed code execution backend.

---

## Features

- Isolated execution of user-submitted code within Docker containers
- Multi-language support:
  - JavaScript
  - Python
  - C++
  - JAVA
- Compilation and runtime error detection (C++,JAVA)
- Custom `stdin` input support
- Captured `stdout` and `stderr` output streams
- Configurable execution timeout enforcement
- CPU and memory resource limiting per container
- Isolated, temporary workspaces with automatic cleanup
- Multi-test-case judging with Accepted / Wrong Answer verdicts
- REST API with request validation and centralized error handling

---

## Architecture

```
                    Client / CodeMeet
                          │
                          │ HTTP
                          ▼
                 ┌──────────────────┐
                 │   Express API    │
                 │  POST /execute   │
                 │  POST /judge     │
                 └────────┬─────────┘
                          │
                          ▼
                    ┌───────────┐
                    │Validation │
                    └─────┬─────┘
                          │
                          ▼
                ┌────────────────────┐
                │  Execution Engine  │
                └─────────┬──────────┘
                          │
             ┌────────────┴────────────┐
             ▼                         ▼
        Execute Code               Judge Code
             │                         │
             │                  (multiple test cases)
             │                         │
             └────────────┬────────────┘
                          ▼
                ┌──────────────────┐
                │ Temp Workspace   │
                └────────┬─────────┘
                          ▼
                ┌──────────────────┐
                │ Docker Container │
                │  CPU:    0.5     │
                │  Memory: 128 MB  │
                │  Timeout: 5s     │
                └────────┬─────────┘
                          ▼
                     User Program
                          │
                 ┌────────┴────────┐
                 ▼                 ▼
              stdout            stderr
                 │                 │
                 └────────┬────────┘
                          ▼
                   JSON Response
```

Each incoming request is validated, passed to the execution engine, and processed within a disposable, resource-constrained container. The result — success, failure, or error — is returned as a single JSON response.

---

## API Reference

### `POST /execute`

Executes a single program with optional standard input and returns its output.

**Request**

```json
{
  "language": "python",
  "code": "print(input())",
  "stdin": "hello world"
}
```

**Response**

```json
{
  "stdout": "hello world\n",
  "stderr": "",
  "exitCode": 0,
  "executionTime": 42
}
```

### `POST /judge`

Executes a submission against a series of test cases and returns a verdict for each.

**Request**

```json
{
  "language": "cpp",
  "code": "// solution source code",
  "testCases": [
    { "input": "1 2", "expectedOutput": "3" },
    { "input": "5 5", "expectedOutput": "10" }
  ]
}
```

**Response**

```json
{
  "verdict": "Accepted",
  "results": [
    { "status": "Accepted", "executionTime": 12 },
    { "status": "Accepted", "executionTime": 11 }
  ]
}
```

> Field names above represent the expected response contract and may vary slightly depending on implementation specifics.

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [Docker](https://www.docker.com/) installed and running
- npm or yarn

### Setup

```bash
git clone https://github.com/your-username/codeengine.git
cd codeengine
npm install
```

### Running the Service

```bash
npm start
```

The API is available at `http://localhost:3000` by default. Docker images for each supported language must be built or pulled prior to first use; refer to the `docker/` directory for the corresponding Dockerfiles.

### Configuration

The following environment variables control runtime behavior:

| Variable | Description | Default |
|---|---|---|
| `PORT` | Port on which the API server listens | `3000` |
| `EXECUTION_TIMEOUT` | Maximum execution time per submission (ms) | `5000` |
| `MEMORY_LIMIT` | Memory limit per execution container | `128m` |
| `CPU_LIMIT` | CPU limit per execution container | `0.5` |

---

## Resource Constraints

Each execution container is subject to the following default limits:

| Resource | Limit |
|---|---|
| CPU | 0.5 cores |
| Memory | 128 MB |
| Execution Timeout | 5 seconds |

These defaults are intended for short-lived, judging-style submissions. Adjust as needed within the execution engine configuration for workloads with different requirements.

---

## Supported Languages

| Language | Compilation Required | Notes |
|---|---|---|
| JavaScript | No | Executed directly via Node.js runtime |
| Python | No | Executed directly via the Python interpreter |
| C++,JAVA | Yes | Compiled prior to execution; compilation errors are reported separately from runtime errors |

Additional languages can be supported by extending the execution engine with a corresponding runner and Docker image.

---

## Roadmap

- Extended language support ( Go, Rust)
- Queue-based execution for improved concurrency handling
- Persistent submission history and storage layer
- Per-client rate limiting
- WebSocket support for streaming execution output

---

## Contributing

Contributions are welcome. When adding support for a new language, the recommended approach is to add a corresponding Dockerfile, implement a runner within the execution engine, and include a test submission verifying correct compilation and runtime error handling.

## License

Distributed under the MIT License.
