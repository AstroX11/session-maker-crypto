# Session Encryptor and Decryptor

This package provides encryption and decryption utilities for Baileys sessions. The code allows you to securely encrypt session data and later decrypt it back to its original state.

## Features

-    **Encrypt Baileys session**: Encrypt your session credentials and synchronization data into a single encrypted file.
-    **Decrypt Baileys session**: Decrypt the encrypted session back into its original JSON files (`creds.json` and `app-state-sync-key-{appStateKeyId}.json`).

## Prerequisites

Before using this tool, make sure you have the session files generated from Baileys. You need the following:

-    `creds.json` (session credentials file)
-    `app-state-sync-key-{appStateKeyId}.json` (sync key file)

## Installation

To use the package, you need Node.js (version 14 or higher) installed. You can install the required dependencies via:

```bash
npm install baileys
```

Or with Yarn:

```bash
yarn install baileys
```

## Usage

### Encrypt Session

To encrypt your Baileys session, use the `encryptSession` function. It merges your session and sync key data, then encrypts the combined data using AES-256-CBC.

```javascript
import { encryptSession } from './sessionEncryptor';

const encryptedSession = encryptSession('path/to/creds.json');
console.log('Encrypted session data:', encryptedSession);
```

The encrypted session is saved to a file named `session.json` in your current working directory.

### Decrypt Session

To decrypt a previously encrypted session, use the `decryptSession` function. It restores the original `creds.json` and sync key files.

```javascript
import { decryptSession } from './sessionEncryptor';

const sessionData = decryptSession('path/to/session.json', './outputDir');
console.log('Decrypted session data:', sessionData);
```

The decrypted session files will be saved in the specified output directory (defaults to `./session`).

## Code Explanation

### `encryptSession(initSession)`

This function:

1. Reads the session and sync key files.
2. Merges the session data and sync key.
3. Encrypts the merged data using AES-256-CBC.
4. Saves the encrypted session as `session.json`.

### `decryptSession(sessionSource, outputDir)`

This function:

1. Reads the encrypted session from the provided file.
2. Decrypts the data using the key and IV from the encrypted file.
3. Restores the original `creds.json` and sync key files into the specified output directory.

## Example

```javascript
import { encryptSession, decryptSession } from './sessionEncryptor';

// Encrypt session
const encryptedSession = encryptSession('path/to/creds.json');
console.log('Encrypted session data:', encryptedSession);

// Decrypt session
const decryptedSession = decryptSession('path/to/session.json', './decryptedSession');
console.log('Decrypted session data:', decryptedSession);
```

## Dependencies

-    `node:fs` (for file operations)
-    `node:crypto` (for encryption and decryption)
-    `node:path` (for path manipulations)
