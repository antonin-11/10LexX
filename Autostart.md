# Lancement automatique au démarrage du Mac

Ce projet est configuré pour se lancer automatiquement au démarrage du Mac via **launchd**.

## Fichier de configuration

Chemin : `~/Library/LaunchAgents/com.devify.10lexx.plist`

## Commandes utiles

```bash
# Activer le lancement automatique
launchctl load ~/Library/LaunchAgents/com.devify.10lexx.plist

# Désactiver le lancement automatique
launchctl unload ~/Library/LaunchAgents/com.devify.10lexx.plist

# Lancer manuellement
launchctl start com.devify.10lexx

# Arrêter manuellement
launchctl stop com.devify.10lexx

# Vérifier le statut
launchctl list | grep 10lexx
```

## Logs

```bash
# Voir les logs en temps réel
tail -f /tmp/10lexx.log

# Voir les erreurs
tail -f /tmp/10lexx.error.log
```

## En cas de problème

1. Vérifier les logs d'erreur : `cat /tmp/10lexx.error.log`
2. Désactiver puis réactiver le service
3. Vérifier que le chemin de pnpm est correct : `which pnpm`
