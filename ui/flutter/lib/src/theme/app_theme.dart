import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:lonanote/src/providers/settings/settings.dart';
import 'package:lonanote/src/theme/theme_colors.dart';
import 'package:pull_down_button/pull_down_button.dart';

class AppTheme {
  /// The light and dark color of the menu's background.
  static const kBackgroundColorNoAlpha = CupertinoDynamicColor.withBrightness(
    color: Color.fromRGBO(247, 247, 247, 1.0),
    darkColor: Color.fromRGBO(36, 36, 36, 1.0),
  );

  static SystemUiOverlayStyle getSystemOverlayStyle(ColorScheme colorScheme) {
    final isLight = colorScheme.brightness == Brightness.light;
    final style =
        isLight ? SystemUiOverlayStyle.light : SystemUiOverlayStyle.dark;
    final iconBrightness = isLight ? Brightness.dark : Brightness.light;
    return style.copyWith(
      statusBarColor: Colors.transparent, // 状态栏背景颜色
      systemNavigationBarColor: Colors.transparent, // 底部导航栏颜色
      systemNavigationBarDividerColor: Colors.transparent,
      systemNavigationBarIconBrightness: iconBrightness,
      statusBarIconBrightness: iconBrightness, // 状态栏字体颜色
      statusBarBrightness: colorScheme.brightness,
      systemNavigationBarContrastEnforced: false,
      systemStatusBarContrastEnforced: false,
    );
  }

  static ThemeData getMaterialThemeData(
    ThemeSettings theme,
    Brightness brightness,
  ) {
    final isLight = brightness == Brightness.light;
    final colorScheme = isLight
        ? const ColorScheme.light().copyWith(
            primary: theme.primaryColor,
          )
        : const ColorScheme.dark().copyWith(
            primary: theme.primaryColor,
          );

    final appBarTheme = AppBarTheme(
        systemOverlayStyle: getSystemOverlayStyle(colorScheme),
        scrolledUnderElevation: 1, // 滚动时AppBar背景颜色自动改变
        titleSpacing: 0.0,
        elevation: 0.0,
        centerTitle: true,
        backgroundColor: ThemeColors.getBgColor(colorScheme), // AppBar的背景颜色
        titleTextStyle: TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.bold,
          color: ThemeColors.getTextColor(colorScheme), // AppBar的字体颜色
        ));
    final themeData = isLight ? ThemeData.light() : ThemeData.dark();
    return themeData.copyWith(
      scaffoldBackgroundColor: ThemeColors.getBgColor(colorScheme),
      brightness: colorScheme.brightness,
      colorScheme: colorScheme,
      appBarTheme: appBarTheme,
      extensions: [getPullDownTheme(colorScheme)],
    );
  }

  static CupertinoThemeData getCupertinoThemeData(
    ThemeSettings theme,
    Brightness brightness,
  ) {
    final isLight = brightness == Brightness.light;
    final colorScheme = isLight
        ? const ColorScheme.light().copyWith(
            primary: theme.primaryColor,
          )
        : const ColorScheme.dark().copyWith(
            primary: theme.primaryColor,
          );
    return CupertinoThemeData(
      brightness: brightness,
      primaryColor: ThemeColors.getPrimaryColor(colorScheme), // 导航栏按钮颜色
      barBackgroundColor: ThemeColors.getBgColor(colorScheme), // 导航栏背景色
      scaffoldBackgroundColor: ThemeColors.getBgColor(colorScheme),
      textTheme: CupertinoTextThemeData(
        primaryColor: ThemeColors.getPrimaryColor(colorScheme),
        navTitleTextStyle: TextStyle(
          // 导航栏字体样式
          fontSize: 18,
          fontWeight: FontWeight.bold,
          color: ThemeColors.getTextColor(colorScheme),
        ),
      ),
    );
  }

  static PullDownButtonTheme getPullDownTheme(ColorScheme colorScheme) {
    return PullDownButtonTheme();
  }

  static PullDownMenuRouteTheme getPullDownMenuRouteThemeNoAlpha(
    BuildContext context,
  ) {
    return PullDownMenuRouteTheme(
      backgroundColor: kBackgroundColorNoAlpha.resolveFrom(context),
    );
  }
}
