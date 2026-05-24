import 'package:flutter/material.dart';

import 'screens/game_screen.dart';

void main() {
  runApp(const AtomasApp());
}

class AtomasApp extends StatelessWidget {
  const AtomasApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Atomas Clone',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: const Color(0xFF1E88E5),
        brightness: Brightness.dark,
      ),
      home: const GameScreen(),
    );
  }
}
