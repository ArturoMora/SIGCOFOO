namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migraMovimientos2 : DbMigration
    {
        public override void Up()
        {
            RenameTable(name: "dbo.MovimientoCategoria", newName: "tab_MovimientoCategoria");
            RenameTable(name: "dbo.MovimientoPuesto", newName: "tab_MovimientoPuesto");
            RenameTable(name: "dbo.MovimientoUnidadOrg", newName: "tab_MovimientoUnidadOrg");
            MoveTable(name: "dbo.tab_MovimientoCategoria", newSchema: "GEN");
            MoveTable(name: "dbo.tab_MovimientoPuesto", newSchema: "GEN");
            MoveTable(name: "dbo.tab_MovimientoUnidadOrg", newSchema: "GEN");
        }
        
        public override void Down()
        {
            MoveTable(name: "GEN.tab_MovimientoUnidadOrg", newSchema: "dbo");
            MoveTable(name: "GEN.tab_MovimientoPuesto", newSchema: "dbo");
            MoveTable(name: "GEN.tab_MovimientoCategoria", newSchema: "dbo");
            RenameTable(name: "dbo.tab_MovimientoUnidadOrg", newName: "MovimientoUnidadOrg");
            RenameTable(name: "dbo.tab_MovimientoPuesto", newName: "MovimientoPuesto");
            RenameTable(name: "dbo.tab_MovimientoCategoria", newName: "MovimientoCategoria");
        }
    }
}
