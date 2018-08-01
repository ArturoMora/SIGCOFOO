namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ajusteId : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CH.tab_AdjuntoCursos", "ModuloId", "GEN.cat_Modulo");
            DropIndex("CH.tab_AdjuntoCursos", new[] { "ModuloId" });
            DropTable("CH.tab_AdjuntoCursos");
        }
        
        public override void Down()
        {
            CreateTable(
                "CH.tab_AdjuntoCursos",
                c => new
                    {
                        AdjuntoId = c.Long(nullable: false, identity: true),
                        RutaCompleta = c.String(nullable: false),
                        nombre = c.String(maxLength: 100),
                        ModuloId = c.String(maxLength: 3),
                        CursoInternoId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.AdjuntoId);
            
            CreateIndex("CH.tab_AdjuntoCursos", "ModuloId");
            AddForeignKey("CH.tab_AdjuntoCursos", "ModuloId", "GEN.cat_Modulo", "ModuloId");
        }
    }
}
