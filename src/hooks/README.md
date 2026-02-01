# Custom React Hooks

Эта папка содержит переиспользуемые React хуки для приложения.

## Соглашения

- Названия хуков начинаются с `use`: `useAuth.ts`, `useLocalStorage.ts`
- Один хук = один файл
- Каждый хук экспортируется через `index.ts`

## Примеры хуков

```typescript
// useAuth.ts
export function useAuth() {
  // логика аутентификации
}

// useLocalStorage.ts
export function useLocalStorage<T>(key: string, initialValue: T) {
  // логика работы с localStorage
}
```

## Использование

```typescript
import { useAuth } from '@/hooks';
// или
import { useAuth } from '@/hooks/useAuth';
```
