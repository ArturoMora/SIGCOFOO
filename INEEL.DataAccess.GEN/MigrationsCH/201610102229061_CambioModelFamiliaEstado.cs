namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CambioModelFamiliaEstado : DbMigration
    {
        public override void Up()
        {
            DropColumn("CH.tab_FamiliaUnidad", "FamiliaPuestosId");
            RenameColumn(table: "CH.tab_FamiliaUnidad", name: "familia_FamiliaId", newName: "FamiliaPuestosId");
            RenameIndex(table: "CH.tab_FamiliaUnidad", name: "IX_familia_FamiliaId", newName: "IX_FamiliaPuestosId");
            AddColumn("CH.tab_FamiliaUnidad", "periodo", c => c.String(maxLength: 4));
        }
        
        public override void Down()
        {
            DropColumn("CH.tab_FamiliaUnidad", "periodo");
            RenameIndex(table: "CH.tab_FamiliaUnidad", name: "IX_FamiliaPuestosId", newName: "IX_familia_FamiliaId");
            RenameColumn(table: "CH.tab_FamiliaUnidad", name: "FamiliaPuestosId", newName: "familia_FamiliaId");
            AddColumn("CH.tab_FamiliaUnidad", "FamiliaPuestosId", c => c.Int());
        }
    }
}
