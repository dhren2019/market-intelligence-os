.PHONY: install dev test check seed sync daily inbox

install:
	pnpm install --frozen-lockfile

dev:
	pnpm dev

test:
	pnpm test

check:
	pnpm typecheck && pnpm lint && pnpm test && pnpm build

seed:
	pnpm db:seed

sync:
	pnpm data:sync

daily:
	pnpm data:daily

inbox:
	pnpm data:inbox
