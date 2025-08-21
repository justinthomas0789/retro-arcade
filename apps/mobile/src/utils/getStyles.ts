const getStyles = (colors: any) => StyleSheet.create({
    container: {
      flex: 1,
    },
    gradient: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderBottomWidth: 2,
      borderBottomColor: colors.primary,
    },
    titleContainer: {
      flex: 1,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.primary,
      fontFamily: 'monospace',
    },
    subtitle: {
      fontSize: 12,
      color: colors.text,
      opacity: 0.8,
      marginTop: 2,
    },
    settingsBtn: {
      padding: 8,
    },
    categoryNav: {
      maxHeight: 60,
    },
    categoryContainer: {
      paddingHorizontal: 20,
      paddingVertical: 15,
      gap: 10,
    },
    categoryBtn: {
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: colors.secondary,
      borderRadius: 20,
      marginRight: 10,
    },
    activeCategoryBtn: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    categoryText: {
      color: colors.secondary,
      fontSize: 14,
      fontWeight: 'bold',
      textTransform: 'uppercase',
    },
    activeCategoryText: {
      color: colors.background,
    },
    gamesContainer: {
      flex: 1,
    },
    gamesContent: {
      padding: 20,
    },
    gamesGrid: {
      gap: 15,
    },
    footer: {
      alignItems: 'center',
      paddingVertical: 30,
      borderTopWidth: 1,
      borderTopColor: colors.secondary,
      marginTop: 30,
    },
    footerText: {
      color: colors.text,
      opacity: 0.6,
      fontSize: 12,
    },
  });