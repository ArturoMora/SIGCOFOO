namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class DescripcionNiveles : DbMigration
    {
        public override void Up()
        {
            AddColumn("CH.cat_DescripcionComportamiento", "NivelId", c => c.Int());
            AddColumn("CH.cat_DescripcionComportamiento", "nivel_NivelCompetenciaId", c => c.Int());
            AddColumn("CH.cat_DescripcionNiveles", "NivelId", c => c.Int());
            AddColumn("CH.cat_DescripcionNiveles", "nivel_NivelCompetenciaId", c => c.Int());
            AlterColumn("CH.cat_DescripcionComportamiento", "Descripcion", c => c.String());
            AlterColumn("CH.cat_DescripcionNiveles", "Descripcion", c => c.String());
            CreateIndex("CH.cat_DescripcionComportamiento", "nivel_NivelCompetenciaId");
            CreateIndex("CH.cat_DescripcionNiveles", "nivel_NivelCompetenciaId");
            AddForeignKey("CH.cat_DescripcionComportamiento", "nivel_NivelCompetenciaId", "CH.cat_NivelesCompetencias", "NivelCompetenciaId");
            AddForeignKey("CH.cat_DescripcionNiveles", "nivel_NivelCompetenciaId", "CH.cat_NivelesCompetencias", "NivelCompetenciaId");
        }
        
        public override void Down()
        {
            DropForeignKey("CH.cat_DescripcionNiveles", "nivel_NivelCompetenciaId", "CH.cat_NivelesCompetencias");
            DropForeignKey("CH.cat_DescripcionComportamiento", "nivel_NivelCompetenciaId", "CH.cat_NivelesCompetencias");
            DropIndex("CH.cat_DescripcionNiveles", new[] { "nivel_NivelCompetenciaId" });
            DropIndex("CH.cat_DescripcionComportamiento", new[] { "nivel_NivelCompetenciaId" });
            AlterColumn("CH.cat_DescripcionNiveles", "Descripcion", c => c.String(maxLength: 300));
            AlterColumn("CH.cat_DescripcionComportamiento", "Descripcion", c => c.String(maxLength: 300));
            DropColumn("CH.cat_DescripcionNiveles", "nivel_NivelCompetenciaId");
            DropColumn("CH.cat_DescripcionNiveles", "NivelId");
            DropColumn("CH.cat_DescripcionComportamiento", "nivel_NivelCompetenciaId");
            DropColumn("CH.cat_DescripcionComportamiento", "NivelId");
        }
    }
}
