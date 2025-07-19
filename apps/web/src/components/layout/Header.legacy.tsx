// // apps/web/src/components/layout/Header.tsx

// import React, { ReactNode } from 'react'
// import { Pressable, StyleSheet, Text, View } from 'react-native'
// import { MAX_WIDTH } from './constants'
// import { AuthModal, Avatar, Button, IconButton, Row } from '@/components'
// import { useNavigation, useNavigationState } from '@react-navigation/native'
// import { useAuth, useModal, useTheme } from '@/hooks'
// import type { AvatarSize } from '@/components'
// import { paddingHorizontal, resolveResponsiveProp, Size } from '@iam/theme'
// import { AuthMode } from '@/types'

// interface HeaderProps {
//     children?: ReactNode
// }

// const Brand = ({ ...props }) => {
//     const { theme } = useTheme()
//     const fontSize = resolveResponsiveProp({ xs: 34, sm: 34, md: 36, lg: 40 })
//     return (
//         <Pressable onPress={props.onPress} style={{ flex: 1, flexShrink: 1 }}>
//             <Row wrap={true} style={{ flexShrink: 1, minWidth: 50, overflow: 'hidden' }}>
//                 <Text
//                     style={[
//                         styles.iam,
//                         {
//                             fontSize,
//                             lineHeight: fontSize,
//                             color: theme.colors.primary,
//                         }
//                     ]}
//                 >
//                     iam
//                 </Text>
//                 {props.showUsername && (
//                     <Text
//                         style={[
//                             styles.eric,
//                             {
//                                 fontSize,
//                                 lineHeight: fontSize,
//                                 color: theme.colors.tertiary,
//                             }
//                         ]}
//                     >
//                         {`${props.user ? props.user.username : 'eric'}`}
//                     </Text>
//                 )}
//             </Row>
//         </Pressable>
//     )
// }

// export const Header: React.FC<HeaderProps> = () => {
//     const { isAuthenticated, user, authenticate } = useAuth()
//     const { showModal } = useModal()
//     const { isDark, theme, toggleTheme } = useTheme()
//     const navigation = useNavigation()

//     const iconSize = resolveResponsiveProp({ xs: 24, sm: 18, md: 18, lg: 20 })
//     const showLabel = resolveResponsiveProp({ xs: false, sm: true, md: true, lg: true })
//     const navSpacing = resolveResponsiveProp({ xs: Size.M, sm: Size.M, md: Size.M, lg: Size.L })
//     const showUsername = resolveResponsiveProp({ xs: false, sm: true, md: true, lg: true })
//     const avatarSize = resolveResponsiveProp({ xs: 'sm', sm: 'md', md: 'md', lg: 'lg' }) as AvatarSize

//     const currentRoute = useNavigationState((state) => state.routes[state.index].name)

//     const showAuthModal = (mode: AuthMode) => {
//         showModal(<AuthModal initialMode={mode} authenticate={authenticate} />)
//     }

// 	return (
//         <Row flex={1} align='center' style={styles.container}>
//             <View style={styles.maxWidthContainer}>
//                 <Row
//                     flex={1}
//                     align='center'
//                     justify='space-between'
//                     wrap={false}
//                     style={{
//                         zIndex: 100,
//                         flexWrap: 'nowrap',
//                     }}
//                 >
//                     <Brand
//                         user={user}
//                         onPress={() => navigation.navigate('Home' as never)}
//                         showUsername={showUsername}
//                     />

//                     <Row
//                         flex={1}
//                         spacing={navSpacing}
//                         align='center'
//                         justify='center'
//                         wrap={false}
//                         style={styles.nav}
//                     >
//                         <IconButton
// 							iconName={isDark ? 'sunny' : 'moon'}
// 							onPress={toggleTheme}
// 							iconSize={iconSize}
// 						/>
//                         {isAuthenticated ? (
//                             <Row
//                                 flex={5}
//                                 spacing={navSpacing}
//                                 align='center'
//                                 justify='center'
//                                 wrap={false}
//                                 style={styles.nav}
//                             >
//                                 <IconButton
// 									label='Chat'
// 									onPress={() => navigation.navigate('Chat' as never)}
// 									iconName='chatbubbles-outline'
// 									iconSize={iconSize}
// 									active={currentRoute === 'Chat'}
// 									showLabel={showLabel}
// 								/>

// 								<IconButton
// 									label='Users'
// 									onPress={() => navigation.navigate('UserList' as never)}
// 									iconName='people-outline'
// 									iconSize={iconSize}
// 									active={currentRoute === 'UserList'}
// 									showLabel={showLabel}
// 								/>
//                                 {user && (
//                                     <Avatar
//                                         user={user}
//                                         size={avatarSize}
//                                         onPress={() => navigation.navigate('Profile' as never)}
//                                     />
//                                 )}
//                             </Row>
//                         ) : (
//                             <Row
// 								spacing={Size.S}
// 								wrap={false}
// 								align='center'
// 								justify='flex-end'
// 								style={{ flexShrink: 0, flexGrow: 0 }}
// 							>
// 								<Button
// 									variant='transparent'
// 									label='Sign Up'
// 									onPress={() => showAuthModal('signup')}
// 									// style={{ paddingHorizontal: 12 }}
// 									// textStyle={{ fontWeight: '600' }}
// 								/>
// 								<Button
// 									variant='transparent'
// 									label='Sign In'
// 									onPress={() => showAuthModal('signin')}
// 									// style={{ paddingHorizontal: 12 }}
// 									// textStyle={{ fontWeight: '600' }}
// 								/>
// 							</Row>
//                         )}
//                     </Row>
//                 </Row>
//             </View>
//         </Row>
//     )
// }

// const styles = StyleSheet.create({
//     container: {
//         width: '100%',
//         paddingVertical: Size.XS,
//     },
//     maxWidthContainer: {
//         flex: 1,
//         width: '100%',
//         maxWidth: MAX_WIDTH,
//         marginHorizontal: 'auto',
//         paddingHorizontal: paddingHorizontal,
//     },
// 	iam: {
// 		fontWeight: 'bold',
//         // color: '#fff',
// 	},
// 	eric: {
// 		fontWeight: 'bold',
//         // color: '#777',
// 	},
//     nav: {
//         flexShrink: 0,
//         flexGrow: 0,
//         flexBasis: 'auto',
//     },
//     buttonLabel: {
//         color: '#fff',
//     },
// })
