# Contributing to LLM File Processor

Добро пожаловать! Мы рады, что вы заинтересованы в развитии этого проекта. Это руководство поможет вам внести ваш первый вклад.

## 🎯 Философия проекта

Этот проект создан как образовательный ресурс для изучения prompt engineering и интеграции с LLM. Мы стремимся к:

- **Ясности кода**: Каждая функция должна быть понятной и хорошо документированной
- **Практичности примеров**: Все демонстрации должны быть реально применимыми
- **Образовательной ценности**: Код должен обучать лучшим практикам

## 🛠️ Как внести вклад

### Сообщение об ошибках

1. **Проверьте существующие issue**: Убедитесь, что проблема ещё не была сообщена
2. **Создайте новое issue** с подробным описанием:
   - Чёткое название и описание
   - Шаги для воспроизведения
   - Ожидаемое и фактическое поведение
   - Информация о системе (ОС, версия Node.js)
   - Если возможно, приложите скриншоты

### Предложение новых функций

1. **Откройте discussion**: Обсудите идею с сообществом
2. **Опишите use case**: Объясните, кому и как это поможет
3. **Рассмотрите альтернативы**: Почему именно такой подход?

### Отправка Pull Request

#### Подготовка окружения разработки

```bash
# Форкните репозиторий на GitHub
# Клонируйте ваш форк
git clone https://github.com/YOUR_USERNAME/llm-file-processor.git
cd llm-file-processor

# Установите зависимости
npm install

# Создайте файл окружения
cp .env.example .env
# Отредактируйте .env и добавьте ваш OpenRouter API ключ

# Запустите в режиме разработки
npm run dev
```

#### Рабочий процесс

1. **Создайте ветку функции**:
```bash
git checkout -b feature/amazing-new-feature
```

2. **Внесите изменения**:
   - Следуйте существующему стилю кода
   - Добавьте комментарии для сложной логики
   - Обновите документацию при необходимости

3. **Зафиксируйте изменения**:
```bash
git add .
git commit -m "feat: add amazing new feature"
```

4. **Синхронизируйтесь с upstream**:
```bash
git remote add upstream https://github.com/original-repo/llm-file-processor.git
git fetch upstream
git rebase upstream/main
```

5. **Отправьте в ваш форк**:
```bash
git push origin feature/amazing-new-feature
```

6. **Создайте Pull Request** на GitHub

## 🧩 Области для вклада

### 1. Улучшение Prompt Engineering

- **Новые примеры промптов**: Демонстрация различных техник
- **Оптимизация структуры промптов**: Более эффективные форматы
- **Обработка краевых случаев**: Работа с большими файлами, специальными форматами

```javascript
// Пример улучшения промпта
// Было:
const prompt = "Analyze this file";

// Стало:
const prompt = `
Perform a comprehensive analysis of the following file:
1. Identify the primary purpose and functionality
2. Note any potential issues or improvements
3. Suggest best practices where applicable
4. Format your response as markdown with clear sections
`;
```

### 2. Поддержка новых типов файлов

Мы приветствуем добавление поддержки:
- PDF файлов
- Image анализа (для моделей с vision)
- Audio/Video метаданных
- Specialised formats (CSV, XML, etc.)

### 3. UI/UX улучшения

- **Accessibility**: ARIA labels, keyboard navigation
- **Responsive design**: Лучшая адаптация для мобильных устройств
- **Dark mode**: Поддержка тёмной темы
- **Drag & drop**: Интерфейс перетаскивания файлов

### 4. Performance оптимизации

- **Lazy loading**: Загрузка файлов по требованию
- **Caching**: Кэширование responses для повторных запросов
- **Stream processing**: Обработка больших файлов потоками

## 📝 Стандарты кода

### JavaScript Style Guide

```javascript
// Используйте const/let вместо var
const apiKey = process.env.OPENAI_API_KEY;
let fileContent = '';

// Предпочитайте arrow functions для коротких функций
const processFile = (file) => file.content.trim();

// Используйте async/await вместо callbacks
async function fetchFiles() {
  try {
    const response = await fetch('/api/files');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Деструктуризация для чистого кода
const { prompt, files } = req.body;

// Template literals для строк
console.log(`Processing ${files.length} files`);
```

### Комментирование кода

```javascript
/**
 * Analyzes multiple files using an LLM
 * @param {string} prompt - User's analysis request
 * @param {Array} files - Array of file objects with content
 * @returns {Promise<string>} - LLM response
 */
async function analyzeFiles(prompt, files) {
  // Validate input parameters
  if (!prompt) throw new Error('Prompt is required');
  
  // Format files for LLM context
  const formattedContent = formatFilesForPrompt(files);
  
  // Send to LLM with error handling
  try {
    return await sendToLLM(prompt, formattedContent);
  } catch (error) {
    console.error('LLM analysis failed:', error);
    throw new Error('Analysis failed, please try again');
  }
}
```

## 🧪 Тестирование

### Ручное тестирование

Перед отправкой PR убедитесь:

1. **Функциональность работает**: Проверьте основные сценарии использования
2. **UI остается отзывчивым**: Тестируйте на разных размерах экрана
3. **Обработка ошибок**: Проверьте edge cases
4. **Разные браузеры**: Chrome, Firefox, Safari

### Добавление тестов

```javascript
// Пример простого теста
function testPromptFormatting() {
  const files = [
    { path: 'test.js', content: 'console.log("test");' }
  ];
  
  const formatted = formatFilesForPrompt(files);
  
  assert(formatted.includes('test.js'));
  assert(formatted.includes('console.log'));
  console.log('✅ Prompt formatting test passed');
}
```

## 📖 Документация

### Обновление README

При добавлении новых функций:
- Обновите раздел Features
- Добавьте примеры использования
- Обновите конфигурационные опции

### Комментарии к коду

```javascript
// ❌ Плохо
function calc(a, b) {
  return a * b + 2;
}

// ✅ Хорошо
/**
 * Calculate the area of rectangle with 2px border
 * @param {number} width - Rectangle width
 * @param {number} height - Rectangle height
 * @returns {number} Total area including border
 */
function calculateRectangleArea(width, height) {
  const area = width * height;
  const borderArea = 2; // 2px border on all sides
  return area + borderArea;
}
```

## 🤝 Сообщество

### Каналы общения

- **GitHub Issues**: Для багов и предложений функций
- **GitHub Discussions**: Для общих вопросов и идей
- **Twitter**: Поделитесь своими экспериментами с `#PromptEngineering`

### Ментorship

Новички в prompt engineering? Мы готовы помочь!
- Задавайте вопросы в Discussions
- Запрашивайте review для своих PR
- Предлагайте улучшения документации

## 🏆 Признание вклада

Мы ценим каждый вклад и отмечаем его:
- Ваше имя будет добавлено в CONTRIBUTORS.md
- Особо значимые вклады будут отмечены в Release Notes
- Активные contributors получат special GitHub badges

## 📋 Checklist для Pull Request

Перед отправкой убедитесь:

- [ ] Код соответствует стандартам проекта
- [ ] Добавлены комментарии к сложной логике
- [ ] Обновлена документация (если необходимо)
- [ ] Проведено ручное тестирование
- [ ] Отсутствуют console.log в production коде
- [ ] .env файл не включён в commit
- [ ] Commit messages следуют conventional format

## ❓ Нужна помощь?

Не стесняйтесь обращаться:
- Создайте issue с тегом "question"
- Напишите в GitHub Discussions
- Посмотрите существующие examples в проекте

---

Спасибо за интерес к проекту! Каждый вклад делает проект лучше и помогает сообществу изучать prompt engineering. 🚀