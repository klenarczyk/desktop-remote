namespace Api.Features.MouseControl;

public interface IMouseService
{
    void MoveMouseBy(int dx, int dy);
    void LeftClick();
    void RightClick();
}