# 论文助手 — 前端（README）

简洁说明文档，帮助你在本地运行和调试前端工程（Vue 3 + Vite + Element Plus）。

## 环境要求

- Node.js：推荐 **>= 20.19.0**（若低版本可能与某些依赖不兼容）
- npm：随 Node 一起安装
- 已安装后端并可访问（默认后端地址：`http://127.0.0.1:8000`）

## 快速启动（开发）

1. 在项目根目录安装依赖：

```bash
npm install
```

1. 启动开发服务器：

```bash
npm run dev
```

1. 打开浏览器访问：

```
http://localhost:5173
```

## 打包与预览

- 生产构建：

```bash
npm run build
```

- 本地预览构建结果（默认 port 4173）：

```bash
npm run preview
```

## 前端与后端交互（必须保证后端已启动）

前端默认与后端 API 交互的基础地址：`http://127.0.0.1:8000`。若后端在其他地址或端口，请修改文件：

```
src/services/api.js
```

将 `baseURL` 改成你的后端地址。

前端会调用的主要后端接口（后端需实现）：

- `GET /api/stats` — 获取统计信息（用于知道总论文数）
- `GET /api/papers?limit=<n>&page=<p>` — 分页拉取论文；本工程按批次（每批 100 条）抓取全部论文，然后在前端以每页 10 条做客户端分页
- `GET /api/papers/search?query=...&max_results=...` — 搜索（可用于限制返回条数）
- `GET /api/papers/{id}` — 单篇论文详情

示例（curl）：

```bash
curl http://127.0.0.1:8000/api/stats
curl "http://127.0.0.1:8000/api/papers?limit=10&page=1"
```

> 注意：若后端接口行为与上述参数不同（例如不支持 `page`），请告知后端实际支持的分页参数（`page` / `offset` / `cursor`），前端可以据此做适配。

## 前端功能概述

- 首页：展示库统计（从 `/api/stats` 拉取）
- 论文列表：默认从后端拉取全部论文（分批请求），前端默认**每页 10 条**，支持：
  - 上一页/下一页/页码跳转
  - 输入页码快速跳转（jumper）
  - 搜索（会调用后端搜索接口并在前端分页显示）
- 论文详情页：展示论文完整信息并可打开 PDF 链接（如果存在）
- 主题页 / RAG 对话：界面已准备，需后端实现对应接口以提供真实数据

## 项目结构（简要）

```
src/
  assets/
  components/      # 公共组件（NavBar, Footer, PaperCard...）
  mock/            # 可选（开发时使用），生产可删除
  router/
  services/        # api 封装与 papersService（与后端交互）
  views/           # 页面（Home, Papers, PaperDetail, Topics, Chat...）
  App.vue
  main.js
```

