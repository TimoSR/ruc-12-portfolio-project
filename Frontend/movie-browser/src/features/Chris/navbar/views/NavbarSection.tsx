import { observer } from 'mobx-react'
import { Navbar } from '../components/Navbar'

export interface NavbarSectionProps {
    className?: string
}

const NavbarSectionBase = ({ className = '' }: NavbarSectionProps) => {


    return (
        <Navbar
            className={className}
        />
    )
}

export const NavbarSection = observer(NavbarSectionBase)
