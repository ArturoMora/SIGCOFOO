namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class idiomaencertificacion : DbMigration
    {
        public override void Up()
        {
            AddColumn("CH.cat_Certificacion", "IdiomaId", c => c.Int(nullable: true));
            CreateIndex("CH.cat_Certificacion", "IdiomaId");
            AddForeignKey("CH.cat_Certificacion", "IdiomaId", "CH.cat_Idioma", "IdiomaId", cascadeDelete: false);
        }
        
        public override void Down()
        {
            DropForeignKey("CH.cat_Certificacion", "IdiomaId", "CH.cat_Idioma");
            DropIndex("CH.cat_Certificacion", new[] { "IdiomaId" });
            DropColumn("CH.cat_Certificacion", "IdiomaId");
        }
    }
}
