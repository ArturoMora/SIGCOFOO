namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RelacionNomina : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CH.cat_NominaCompetencias",
                c => new
                    {
                        RelacionId = c.Int(nullable: false, identity: true),
                        ClaveCategoria = c.String(maxLength: 10),
                        categoriaEmpleado = c.String(maxLength: 180),
                        categoriaCompetencia = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.RelacionId)
                .ForeignKey("CH.cat_CategoriasPorFamilia", t => t.categoriaCompetencia, cascadeDelete: true)
                .Index(t => t.categoriaCompetencia);
            
        }
        
        public override void Down()
        {
            DropForeignKey("CH.cat_NominaCompetencias", "categoriaCompetencia", "CH.cat_CategoriasPorFamilia");
            DropIndex("CH.cat_NominaCompetencias", new[] { "categoriaCompetencia" });
            DropTable("CH.cat_NominaCompetencias");
        }
    }
}
