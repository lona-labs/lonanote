# LonaNote


### 开发

#### 开发环境

- Windows / Mac / Linux
  - `Rust` >= 1.85.0-nightly
  - `Node` >= 20
  - `pnpm` >= 9.15.0
  - 安装 `npm install -g @napi-rs/cli`
- Android
  - 安装 `Android Studio` 和附带的 `SDK (33+)`、`NDK (27.0.12077973)`、`Platform-Tools`
  - 设置 `<android studio installation path>/jbr` 目录到JAVA_HOME 环境变量
  - 设置 `ndk` 路径到 `NDK_HOME` 环境变量
  - 设置 `sdk` 路径到 `ANDROID_HOME` 环境变量
- IOS
  - 安装 `XCode`


#### 运行 Windows / Mac / Linux

```shell
pnpm -C ui dev
```

#### 打包

```shell
# windows
pnpm -C ui build:win

# macos
pnpm -C ui build:mac

# linux
pnpm -C ui build:linux

# android
pnpm -C ui build:android

# ios
pnpm -C ui build:ios
```

#### 运行 Android / IOS

- 运行 Android

```shell
cd ./ui

# 提前使用 USB 连接真机或启动 AndroidStudio 模拟器
pnpm dev:android
```

- 运行 IOS

```shell
cd ./ui

# 提前使用 USB 连接真机或启动 IOS 模拟器
pnpm dev:ios
```

> 首次运行应用程序时会被阻止
>
> 转到手机 Settings > Privacy & Security > Developer Mode以启用开发者模式
>
> 然后转到 Settings -> General -> VPN and device management -> From "Developer App"
>
> 按 "Apple Development: APPLE_ID"->"信任"
