# YouTube Auto DownLoader
![Tests](https://github.com/Guusvanmeerveld/ytadl/actions/workflows/test.yml/badge.svg)
![Publish](https://github.com/Guusvanmeerveld/ytadl/actions/workflows/deploy.yml/badge.svg)

> ytadl is a simple package to listen for new uploads on Youtube and stream them automatically.

## Index
- [YouTube Auto DownLoader](#youtube-auto-downloader)
  - [Index](#index)
  - [Overview](#overview)

## Overview
To get started, install the package:

```bash
npm install ytadl
```

The essence of the package is really simple. You import the class, instantiate a new one and listen for events just like with an `EventEmitter`. A simple example looks like the following:

```ts
import fs from "fs";

import Listener from "ytadl";

const listener = new Listener([{ name: 'Example Youtube channel'} ]);

listener.on('newItem', async (item) => {
	const writeStream = fs.createWriteStream(item.title);

	const stream = await item.stream();

	stream.pipe(writeStream);
});
```