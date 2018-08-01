namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class itfAutores : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "MT.AutorITF",
                c => new
                    {
                        AutorITFId = c.String(nullable: false, maxLength: 128),
                        InformeTecnicoFinalId = c.String(maxLength: 25),
                        Estado = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.AutorITFId)
                .ForeignKey("MT.InformeTecnicoFinal", t => t.InformeTecnicoFinalId)
                .Index(t => t.InformeTecnicoFinalId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("MT.AutorITF", "InformeTecnicoFinalId", "MT.InformeTecnicoFinal");
            DropIndex("MT.AutorITF", new[] { "InformeTecnicoFinalId" });
            DropTable("MT.AutorITF");
        }
    }
}
