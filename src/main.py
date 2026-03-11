"""
FastAPI 应用入口

启动 API 服务
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.api.routes import router as paper_router
from core.api.topic_routes import router as topic_router


# 创建应用
app = FastAPI(
    title="论文助手API",
    description="""
    功能
    
    - 论文查询和管理
    - 主题发现和分析
    - 智能搜索
    - 统计分析
    
    使用方法
    
    1. 查看 /docs 获取完整文档
    2. 使用 /api/papers 获取论文列表
    3. 使用 /api/papers/search 搜索论文
    4. 使用 /api/topics 查看主题分类
    """,
    version="1.0.0"
)

# 配置 CORS（允许跨域请求）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境限制具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(paper_router)
app.include_router(topic_router)


# 根路径
@app.get("/", tags=["系统"])
def read_root():
    """
    欢迎页面
    
    返回 API 基本信息
    """
    return {
        "name": "论文助手 API",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "papers": "/api/papers",
            "search": "/api/papers/search",
            "stats": "/api/stats",
            "topics": "/api/topics"
        }
    }


# 健康检查
@app.get("/health", tags=["系统"])
def health_check():
    """
    健康检查端点
    
    用于监控服务状态
    """
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    
    # 运行服务
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
