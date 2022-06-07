# Worker Sync

[![Latest Version](https://img.shields.io/github/v/release/eyal-shalev/worker_sync?sort=semver&label=Version)](https://github.com/Eyal-Shalev/worker_sync)
[![Test](https://github.com/Eyal-Shalev/worker_sync/actions/workflows/test.yml/badge.svg)](https://github.com/Eyal-Shalev/worker_sync/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/Eyal-Shalev/worker_sync/branch/main/graph/badge.svg?token=9EWOZTN2BP)](https://codecov.io/gh/Eyal-Shalev/worker_sync)
[![nodejs minimum version](https://img.shields.io/node/v/@eyalsh/worker_sync)](https://www.npmjs.com/package/@eyalsh/worker_sync)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

JavaScript synchronization functions (mutex, semaphore) between workers (and the
main thread).

## Setup

### NodeJS

Released under both npmjs & github packages:

[![npmjs.com:@eyalsh/worker_sync](https://img.shields.io/badge/npmjs.com-%40eyalsh%2Fworker__sync-%23cc0000)](https://www.npmjs.com/package/@eyalsh/worker_sync)
[![github.com:@Eyal-Shalev/worker_sync](https://img.shields.io/badge/github.com-%40eyal--shalev%2Fworker__sync-%233399db)](https://github.com/Eyal-Shalev/worker_sync/packages/1467412)

**Install:**

<details open markdown="block">
<summary>npm</summary>

```shell
npm install @eyalsh/worker_sync
```

</details>

<details markdown="block">
<summary>yarn</summary>

```shell
yarn add @eyal-shalev/worker_sync
```

</details>

**import (ES Modules):**

```js
import { Mutex, Semaphore } from "@eyalsh/worker_sync";
```

**require (CommonJS):**

```js
const { Semaphore, Mutex } = require("@eyalsh/worker_sync");
```

### Deno

The library is available to import from
[deno.land/x/worker_sync](://deno.land/x/worker_sync)

```ts
import { Mutex, Semaphore } from "https://deno.land/x/worker_sync/mod.ts";
```

### Browser - Download

You can download compiled library from GitHub:

- [Latest Release](://github.com/Eyal-Shalev/worker_sync/releases/latest)
- [All Releases](://github.com/Eyal-Shalev/worker_sync/releases)

```js
import { Mutex, Semaphore } from "/path/to/worker_sync.esm.min.js";
```

_Note: a bundled IIFE version also exist, if your application doesn't support ES
modules._

```html
<script src="/path/to/worker_sync.iife.min.js"></script>
<script>
  const {Semaphore, Mutex} = worker_sync;
</script>
```
