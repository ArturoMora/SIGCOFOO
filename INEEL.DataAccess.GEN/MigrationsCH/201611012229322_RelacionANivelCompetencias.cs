namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RelacionANivelCompetencias : DbMigration
    {
        public override void Up()
        {
            DropColumn("CH.cat_DescripcionNiveles", "NivelId");
            RenameColumn(table: "CH.cat_DescripcionNiveles", name: "nivel_NivelCompetenciaId", newName: "NivelId");
            RenameIndex(table: "CH.cat_DescripcionNiveles", name: "IX_nivel_NivelCompetenciaId", newName: "IX_NivelId");
        }
        
        public override void Down()
        {
            RenameIndex(table: "CH.cat_DescripcionNiveles", name: "IX_NivelId", newName: "IX_nivel_NivelCompetenciaId");
            RenameColumn(table: "CH.cat_DescripcionNiveles", name: "NivelId", newName: "nivel_NivelCompetenciaId");
            AddColumn("CH.cat_DescripcionNiveles", "NivelId", c => c.Int());
        }
    }
}
