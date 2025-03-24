import {HeaderContent, Line, Subtitle} from "./styles";

export default function TitleContent({ title }) {
    return (
        <HeaderContent>
            <Subtitle>{title}</Subtitle>
            <Line></Line>
        </HeaderContent>
    )

}