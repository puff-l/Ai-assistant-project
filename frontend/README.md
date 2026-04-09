# 论文助手 - 前端 (Vue 3 + Vite)

此项目是一个前端演示，连接到后端（FastAPI）: http://127.0.0.1:8000

**注意**: 后端部分有些端点未实现，前端会在接口调用失败时自动回退到本地模拟数据（位于 `src/mock`）。

## 快速启动（前端）

```bash
# 在项目根目录下
npm install
npm run dev
```

默认 Vite 开发服务器在 http://localhost:5173

## 启动后端（参考）
后端示例（您已提供）:
```bash
# 进入后端 src 目录，然后启动 Uvicorn
cd src
uvicorn main:app --reload
```

## 打包预览
```bash
npm run build
npm run preview
```

