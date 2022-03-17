# deno-http-server-benchmark

Comparison of performance - requests per second - using Deno HTTP server, text, JSON, PostgreSQL query results.

## Requirements

* For HTTP service:
  * [Deno](https://deno.land/)

* For calling HTTP service:
  * [Node](https://nodejs.org/)
  * [autocannon](https://www.npmjs.com/package/autocannon)

## Configuration

Copy `.env.example` as `.env` and review the settings.

## Execution

Terminal 1:

```sh
deno run --allow-env --allow-net --allow-read --allow-write --unstable ./index.ts
```

Terminal 2:

```sh
autocannon http://localhost:8000/
autocannon http://localhost:8000/json
autocannon http://localhost:8000/sql1
autocannon http://localhost:8000/sql2
```

## Summary

Average Req/Sec:

| Text | JSON | PgSQL 1 | PgSQL 2 |
| - | - | - | - |
| 75k | 66k | 21k | 0.2k |

## Results for Hello world - Text output

Send fixed/same text all the time 'Hello world'.

```
Running 10s test @ http://localhost:8000
10 connections

┌─────────┬──────┬──────┬───────┬──────┬─────────┬─────────┬──────┐
│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%  │ Avg     │ Stdev   │ Max  │
├─────────┼──────┼──────┼───────┼──────┼─────────┼─────────┼──────┤
│ Latency │ 0 ms │ 0 ms │ 0 ms  │ 0 ms │ 0.01 ms │ 0.02 ms │ 5 ms │
└─────────┴──────┴──────┴───────┴──────┴─────────┴─────────┴──────┘
┌───────────┬─────────┬─────────┬─────────┬─────────┬──────────┬─────────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg      │ Stdev   │ Min     │
├───────────┼─────────┼─────────┼─────────┼─────────┼──────────┼─────────┼─────────┤
│ Req/Sec   │ 72255   │ 72255   │ 75839   │ 76351   │ 75365.82 │ 1073.17 │ 72194   │
├───────────┼─────────┼─────────┼─────────┼─────────┼──────────┼─────────┼─────────┤
│ Bytes/Sec │ 9.25 MB │ 9.25 MB │ 9.71 MB │ 9.77 MB │ 9.65 MB  │ 137 kB  │ 9.24 MB │
└───────────┴─────────┴─────────┴─────────┴─────────┴──────────┴─────────┴─────────┘

Req/Bytes counts sampled once per second.
# of samples: 11

829k requests in 11.01s, 106 MB read
```

## Results for simple JSON message

Send JSON string for object:

```javascript
const body = { message: "Hello world", ts: new Date() };
```

```
Running 10s test @ http://localhost:8000/json
10 connections

┌─────────┬──────┬──────┬───────┬──────┬─────────┬─────────┬──────┐
│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%  │ Avg     │ Stdev   │ Max  │
├─────────┼──────┼──────┼───────┼──────┼─────────┼─────────┼──────┤
│ Latency │ 0 ms │ 0 ms │ 0 ms  │ 0 ms │ 0.01 ms │ 0.02 ms │ 5 ms │
└─────────┴──────┴──────┴───────┴──────┴─────────┴─────────┴──────┘
┌───────────┬─────────┬─────────┬───────┬─────────┬───────┬─────────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%   │ 97.5%   │ Avg   │ Stdev   │ Min     │
├───────────┼─────────┼─────────┼───────┼─────────┼───────┼─────────┼─────────┤
│ Req/Sec   │ 63359   │ 63359   │ 66559 │ 67327   │ 66320 │ 1055.32 │ 63358   │
├───────────┼─────────┼─────────┼───────┼─────────┼───────┼─────────┼─────────┤
│ Bytes/Sec │ 10.5 MB │ 10.5 MB │ 11 MB │ 11.2 MB │ 11 MB │ 175 kB  │ 10.5 MB │
└───────────┴─────────┴─────────┴───────┴─────────┴───────┴─────────┴─────────┘

Req/Bytes counts sampled once per second.
# of samples: 11

730k requests in 11.01s, 121 MB read
```

## Results for getting time from PostgreSQL v1

Send result of query:

```sql
SELECT now() AS ts;
```

```
Running 10s test @ http://localhost:8000/sql1
10 connections

┌─────────┬──────┬──────┬───────┬──────┬─────────┬─────────┬──────┐
│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%  │ Avg     │ Stdev   │ Max  │
├─────────┼──────┼──────┼───────┼──────┼─────────┼─────────┼──────┤
│ Latency │ 0 ms │ 0 ms │ 0 ms  │ 0 ms │ 0.01 ms │ 0.07 ms │ 8 ms │
└─────────┴──────┴──────┴───────┴──────┴─────────┴─────────┴──────┘
┌───────────┬─────────┬─────────┬─────────┬─────────┬──────────┬─────────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg      │ Stdev   │ Min     │
├───────────┼─────────┼─────────┼─────────┼─────────┼──────────┼─────────┼─────────┤
│ Req/Sec   │ 20191   │ 20191   │ 21263   │ 21407   │ 21178.91 │ 318.97  │ 20178   │
├───────────┼─────────┼─────────┼─────────┼─────────┼──────────┼─────────┼─────────┤
│ Bytes/Sec │ 5.89 MB │ 5.89 MB │ 6.21 MB │ 6.25 MB │ 6.18 MB  │ 93.3 kB │ 5.89 MB │
└───────────┴─────────┴─────────┴─────────┴─────────┴──────────┴─────────┴─────────┘

Req/Bytes counts sampled once per second.
# of samples: 11

233k requests in 11.01s, 68 MB read
```

## Results for random list of records from PostgreSQL v2

Send result of query:

```sql
SELECT id, full_name, email FROM users LIMIT 10 OFFSET $offset;
```

Offset is randomly chosen between 0 and the rough number of records.

```
Running 10s test @ http://localhost:8000/sql2
10 connections

┌─────────┬──────┬───────┬───────┬───────┬──────────┬──────────┬────────┐
│ Stat    │ 2.5% │ 50%   │ 97.5% │ 99%   │ Avg      │ Stdev    │ Max    │
├─────────┼──────┼───────┼───────┼───────┼──────────┼──────────┼────────┤
│ Latency │ 2 ms │ 40 ms │ 88 ms │ 94 ms │ 41.43 ms │ 27.65 ms │ 120 ms │
└─────────┴──────┴───────┴───────┴───────┴──────────┴──────────┴────────┘
┌───────────┬────────┬────────┬────────┬────────┬────────┬─────────┬────────┐
│ Stat      │ 1%     │ 2.5%   │ 50%    │ 97.5%  │ Avg    │ Stdev   │ Min    │
├───────────┼────────┼────────┼────────┼────────┼────────┼─────────┼────────┤
│ Req/Sec   │ 210    │ 210    │ 239    │ 258    │ 238.2  │ 13.31   │ 210    │
├───────────┼────────┼────────┼────────┼────────┼────────┼─────────┼────────┤
│ Bytes/Sec │ 238 kB │ 238 kB │ 271 kB │ 293 kB │ 270 kB │ 15.2 kB │ 238 kB │
└───────────┴────────┴────────┴────────┴────────┴────────┴─────────┴────────┘

Req/Bytes counts sampled once per second.
# of samples: 10

2k requests in 10.02s, 2.7 MB read
```
