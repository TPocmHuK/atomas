import 'package:flutter/material.dart';

import '../game/game_state.dart';
import '../widgets/game_board.dart';

class GameScreen extends StatefulWidget {
  const GameScreen({super.key});

  @override
  State<GameScreen> createState() => _GameScreenState();
}

class _GameScreenState extends State<GameScreen> {
  late GameState _state;

  @override
  void initState() {
    super.initState();
    _state = GameState.newGame();
  }

  void _onPlace(int index) {
    if (_state.isGameOver) return;
    setState(() {
      _state.place(index);
    });
    if (_state.isGameOver) {
      WidgetsBinding.instance.addPostFrameCallback((_) => _showGameOver());
    }
  }

  void _showGameOver() {
    showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Game Over'),
        content: Text('Final score: ${_state.score}'),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(ctx).pop();
              setState(() => _state = GameState.newGame());
            },
            child: const Text('Play again'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF101522),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1A2238),
        foregroundColor: Colors.white,
        title: const Text('Atomas Clone'),
        actions: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Center(
              child: Text(
                'Score: ${_state.score}',
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
            ),
          ),
          IconButton(
            tooltip: 'Restart',
            icon: const Icon(Icons.refresh),
            onPressed: () =>
                setState(() => _state = GameState.newGame()),
          ),
        ],
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: AspectRatio(
            aspectRatio: 1,
            child: GameBoard(state: _state, onPlace: _onPlace),
          ),
        ),
      ),
    );
  }
}
