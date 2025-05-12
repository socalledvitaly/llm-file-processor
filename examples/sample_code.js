// Пример JavaScript файла для демонстрации анализа кода
// Этот файл содержит различные концепции для тестирования prompt engineering

/**
 * Класс для работы с файлами и AI анализом
 * Демонстрирует ООП принципы и асинхронные операции
 */
class FileAnalyzer {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.cache = new Map();
        this.maxCacheSize = 100;
    }

    /**
     * Анализирует файл с помощью LLM
     * @param {string} filePath - Путь к файлу
     * @param {string} prompt - Промпт для анализа
     * @returns {Promise<string>} Результат анализа
     */
    async analyzeFile(filePath, prompt) {
        // Проверяем кэш для избежания повторных запросов
        const cacheKey = `${filePath}-${prompt}`;
        if (this.cache.has(cacheKey)) {
            console.log(`📦 Возвращаем из кэша: ${filePath}`);
            return this.cache.get(cacheKey);
        }

        try {
            // Читаем содержимое файла
            const content = await this.readFile(filePath);
            
            // Отправляем в LLM для анализа
            const analysis = await this.sendToLLM(prompt, content);
            
            // Сохраняем в кэш
            this.updateCache(cacheKey, analysis);
            
            return analysis;
        } catch (error) {
            console.error(`❌ Ошибка при анализе файла ${filePath}:`, error);
            throw new Error(`Не удалось проанализировать файл: ${error.message}`);
        }
    }

    /**
     * Читает содержимое файла
     * @param {string} filePath - Путь к файлу
     * @returns {Promise<string>} Содержимое файла
     */
    async readFile(filePath) {
        // В реальном приложении здесь была бы логика чтения файла
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(`// Содержимое файла ${filePath}`);
            }, 100);
        });
    }

    /**
     * Отправляет запрос в Language Model
     * @param {string} prompt - Промпт
     * @param {string} content - Содержимое для анализа
     * @returns {Promise<string>} Ответ от LLM
     */
    async sendToLLM(prompt, content) {
        // Симуляция API вызова
        const mockResponse = `
        Анализ завершён.
        
        Основные находки:
        1. Код использует современные JavaScript возможности
        2. Присутствует обработка ошибок
        3. Кэширование помогает оптимизировать производительность
        
        Рекомендации:
        - Добавить типизацию с TypeScript
        - Реализовать retry механизм для API вызовов
        - Добавить юнит-тесты
        `;
        
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockResponse), 1000);
        });
    }

    /**
     * Обновляет кэш с ограничением размера
     * @param {string} key - Ключ кэша
     * @param {any} value - Значение
     */
    updateCache(key, value) {
        if (this.cache.size >= this.maxCacheSize) {
            // Удаляем старейший элемент (LRU стратегия)
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, value);
    }

    /**
     * Пакетный анализ множества файлов
     * @param {string[]} filePaths - Массив путей к файлам
     * @param {string} prompt - Общий промпт
     * @returns {Promise<Object[]>} Результаты анализа
     */
    async batchAnalysis(filePaths, prompt) {
        const results = [];
        
        // Используем Promise.allSettled для обработки ошибок отдельных файлов
        const analyses = await Promise.allSettled(
            filePaths.map(path => this.analyzeFile(path, prompt))
        );
        
        analyses.forEach((result, index) => {
            results.push({
                filePath: filePaths[index],
                status: result.status,
                result: result.status === 'fulfilled' ? result.value : result.reason
            });
        });
        
        return results;
    }
}

// Пример использования
async function demonstrateUsage() {
    const analyzer = new FileAnalyzer('your-api-key');
    
    try {
        // Одиночный анализ файла
        const result = await analyzer.analyzeFile(
            'src/utils.js', 
            'Проанализируй этот код на предмет безопасности и производительности'
        );
        console.log('🔍 Результат анализа:', result);
        
        // Пакетный анализ
        const batchResults = await analyzer.batchAnalysis(
            ['src/app.js', 'src/api.js', 'src/config.js'],
            'Найди потенциальные уязвимости в коде'
        );
        console.log('📚 Результаты пакетного анализа:', batchResults);
        
    } catch (error) {
        console.error('💥 Критическая ошибка:', error);
    }
}

// Экспортируем класс для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FileAnalyzer;
}

// Запускаем демонстрацию если файл запущен напрямую
if (require.main === module) {
    demonstrateUsage();
}