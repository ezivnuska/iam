import React, { useEffect, useMemo, useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
// import { Icon, Text } from 'react-native-paper'
import SelectDropdown from 'react-native-select-dropdown'
import { useDeviceInfo, useTheme } from '@shared/hooks'
import {
    getDate,
    getDay,
    getMonth,
    getYear,
    endOfDay,
    format,
    formatDistance,
    formatRelative,
    subDays,
    getDaysInMonth,
    parseISO,
} from 'date-fns'
import { Memory } from '@iam/types'
import Ionicons from '@expo/vector-icons/Ionicons'

type SelectorOptions = {
    index: number
    label: string
    value: number
}

type SelectDropdownRef = {
    selectIndex: (index: number) => void
}

type DateSelectorProps = {
    onChange: (date: Date) => void
    memory?: Memory
}


const DateSelector = ({ onChange, memory }: DateSelectorProps) => {

    const { orientation } = useDeviceInfo()
    const landscape = useMemo(() => orientation === 'landscape', [orientation])

    const { theme } = useTheme()

    const today = new Date(Date.now())

    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    const [years, setYears] = useState<SelectorOptions[]>([])
    const [months, setMonths] = useState<SelectorOptions[]>([])
    const [days, setDays] = useState<SelectorOptions[]>([])

    const [year, setYear] = useState<number>(memory ? getYear(memory.date) : getYear(today))
    const [month, setMonth] = useState<number>(memory ? getMonth(memory.date || today) : getMonth(today))
    const [day, setDay] = useState<number>(memory ? getDate(memory.date || today) : getDate(today))

    const selectYearRef = useRef<SelectDropdown>(null)
    const selectMonthRef = useRef<SelectDropdown>(null)
    const selectDayRef = useRef<SelectDropdown>(null)

    const selectedDate = useMemo(() => new Date(year, month, day), [year, month, day])

    useEffect(() => {

        // onChange(today)
        
        initOptions()

        // console.log('memory', memory)
    }, [])

    const initOptions = () => {
        const yearOptions = getYearOptions()
        const monthOptions = getMonthOptions()
        setYears(yearOptions)
        setMonths(monthOptions)
    }

    const initDayOptions = () => {
        if (!year && !month) return
        const dayOptions = getDayOptions(year, month)
        setDays(dayOptions)

        const newDay = (Number(day) > dayOptions.length)
            ? dayOptions.length
            : Number(day)
        
        setDay(newDay)
    }

    useEffect(() => {
        onChange(selectedDate)
    }, [selectedDate])

    useEffect(() => {
        initDayOptions()
    }, [year])

    useEffect(() => {
        initDayOptions()
    }, [month])

    useEffect(() => {
        if (selectDayRef.current) {
            selectDayRef.current.selectIndex(day - 1)
        }
    }, [days])

    const selectYear = () => {
        if (selectYearRef.current) {

            let index = -1
            years.map((y, i) => {
                if (y.value === year) {
                    index = i
                }
            })

            if (index > -1) selectYearRef.current.selectIndex(index)
        }
    }

    useEffect(() => {
        if (selectYearRef.current) {
            selectYear()
        }
    }, [selectYearRef.current])

    useEffect(() => {
        if (selectMonthRef.current) {
            selectMonthRef.current.selectIndex(month)
        }
    }, [selectMonthRef.current])

    const getYearOptions = () => {
        const max = getYear(today)
        const min = max - 119
        const options = []
        let index = 0
        let y = max
        while (y >= min) {
            options.push({ index, label: String(y), value: y })
            y--
            index++
        }
        return options
    }

    const getMonthOptions = () => monthLabels.map((label, index) => ({ index, label, value: index }))

    const getDayOptions = (year: number, month: number) => {
        
        const daysInMonth = getDaysInMonth(new Date(year, month))
        let index = 1
        const options = []
        while(index <= daysInMonth) {
            options.push({ index, label: String(index), value: index })
            index++
        }
        return options
    }

    // const getFormattedMonth = month => {
    //     return month.toString().length < 2 ? '0' + month : month
    // }

    return (
        <View
            style={{
                width: '100%',
                flexDirection: landscape ? 'row' : 'column',
                alignItems: 'center',
                gap: 20,
                marginHorizontal: 'auto',
            }}
        >

            <View style={[styles.buttonContainer, { backgroundColor: theme.colors.altBackground }]}>
                <View style={{ flex: 1 }}>
                    <SelectDropdown
                        ref={selectMonthRef}
                        data={months}
                        onSelect={selectedItem => setMonth(selectedItem.value)}
                        showsVerticalScrollIndicator={false}
                        dropdownStyle={styles.menuStyle}
                        renderButton={(selectedItem, isOpened) => (
                            <View style={styles.button}>
                                <Text style={[styles.buttonTextStyle, { color: theme.colors.altText }]}>
                                    {(selectedItem && selectedItem.label) || month || 'Month' }
                                </Text>
                                <Ionicons name='chevron-down' size={20} color={theme.colors.altText} style={styles.icon} />
                            </View>
                        )}
                        renderItem={(item, index, isSelected) => (
                            <View
                                key={`month-${index}`}
                                style={{
                                    ...styles.dropdownItemStyle,
                                    ...(isSelected && { backgroundColor: '#D2D9DF' })
                                }}
                            >
                                <Text style={styles.itemTextStyle}>
                                    {item.label}
                                </Text>
                            </View>
                        )}
                    />
                </View>

                <View style={{ flex: 1 }}>
                    <SelectDropdown
                        ref={selectDayRef}
                        data={days}
                        onSelect={selectedItem => setDay(selectedItem.value)}
                        showsVerticalScrollIndicator={false}
                        dropdownStyle={styles.menuStyle}
                        renderButton={(selectedItem, isOpened) => (
                            <View style={[styles.button, styles.buttonCenter]}>
                                <Text style={[styles.buttonTextStyle, { color: theme.colors.altText }]}>
                                    {(selectedItem && selectedItem.label) || day || 'Day' }
                                </Text>
                                <Ionicons name='chevron-down' size={20} color={theme.colors.altText} style={styles.icon} />
                            </View>
                        )}
                        renderItem={(item, index, isSelected) => (
                            <View
                                key={`day-${index}`}
                                style={{
                                    ...styles.dropdownItemStyle,
                                    ...(isSelected && { backgroundColor: '#D2D9DF' })
                                }}
                            >
                                <Text style={styles.itemTextStyle}>
                                    {item.label}
                                </Text>
                            </View>
                        )}
                    />
                </View>

                <View style={{ flex: 1 }}>
                    <SelectDropdown
                        ref={selectYearRef}
                        data={years}
                        onSelect={selectedItem => setYear(selectedItem.value)}
                        showsVerticalScrollIndicator={false}
                        dropdownStyle={styles.menuStyle}
                        renderButton={(selectedItem, isOpened) => (
                            <View style={styles.button}>
                                <Text style={[styles.buttonTextStyle, { color: theme.colors.altText }]}>
                                    {(selectedItem && selectedItem.label) || year || 'Year' }
                                </Text>
                                <Ionicons name='chevron-down' size={20} color={theme.colors.altText} style={styles.icon} />
                            </View>
                        )}
                        renderItem={(item, index, isSelected) => (
                            <View
                                key={`year-${index}`}
                                style={{
                                    ...styles.dropdownItemStyle,
                                    ...(isSelected && {backgroundColor: '#D2D9DF'})
                                }}
                            >
                                <Text style={styles.itemTextStyle}>
                                    {item.label}
                                </Text>
                            </View>
                        )}
                    />
                    
                </View>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        flex: 1,
        width: '100%',
        height: 48,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        borderRadius: 24,
        overflow: 'hidden',
    },
    button: {
        flex: 1,
        paddingVertical: 9,
        height: 48,
        // backgroundColor: '#E9ECEF',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 12,
    },
    buttonCenter: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#ccc',
    },
    buttonTextStyle: {
        fontSize: 24,
        lineHeight: 30,
        fontWeight: 600,
        color: '#151E26',
        textAlign: 'center',
    },
    icon: {
        paddingTop: 4,
    },
    menuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
    },
    dropdownItemStyle: {
        width: '100%',
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    itemTextStyle: {
        flex: 1,
        fontSize: 24,
        lineHeight: 30,
        fontWeight: '600',
        color: '#151E26',
        textAlign: 'center',
    },
})

export default DateSelector