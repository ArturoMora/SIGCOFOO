namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class lengthITFGral : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("MT.AdjuntoITF", "ITFgeneralId", "MT.InformeTFgeneral");
            DropForeignKey("MT.InformeTecnicoFinal", "ITFgeneralId", "MT.InformeTFgeneral");
            DropIndex("MT.InformeTecnicoFinal", new[] { "ITFgeneralId" });
            DropIndex("MT.AdjuntoITF", new[] { "ITFgeneralId" });
            DropPrimaryKey("MT.InformeTFgeneral");
            AlterColumn("MT.InformeTecnicoFinal", "ITFgeneralId", c => c.String(maxLength: 25));
            AlterColumn("MT.InformeTFgeneral", "ITFgeneralId", c => c.String(nullable: false, maxLength: 25));
            AlterColumn("MT.AdjuntoITF", "ITFgeneralId", c => c.String(maxLength: 25));
            AddPrimaryKey("MT.InformeTFgeneral", "ITFgeneralId");
            CreateIndex("MT.InformeTecnicoFinal", "ITFgeneralId");
            CreateIndex("MT.AdjuntoITF", "ITFgeneralId");
            AddForeignKey("MT.AdjuntoITF", "ITFgeneralId", "MT.InformeTFgeneral", "ITFgeneralId");
            AddForeignKey("MT.InformeTecnicoFinal", "ITFgeneralId", "MT.InformeTFgeneral", "ITFgeneralId");
        }
        
        public override void Down()
        {
            DropForeignKey("MT.InformeTecnicoFinal", "ITFgeneralId", "MT.InformeTFgeneral");
            DropForeignKey("MT.AdjuntoITF", "ITFgeneralId", "MT.InformeTFgeneral");
            DropIndex("MT.AdjuntoITF", new[] { "ITFgeneralId" });
            DropIndex("MT.InformeTecnicoFinal", new[] { "ITFgeneralId" });
            DropPrimaryKey("MT.InformeTFgeneral");
            AlterColumn("MT.AdjuntoITF", "ITFgeneralId", c => c.String(maxLength: 10));
            AlterColumn("MT.InformeTFgeneral", "ITFgeneralId", c => c.String(nullable: false, maxLength: 10));
            AlterColumn("MT.InformeTecnicoFinal", "ITFgeneralId", c => c.String(maxLength: 10));
            AddPrimaryKey("MT.InformeTFgeneral", "ITFgeneralId");
            CreateIndex("MT.AdjuntoITF", "ITFgeneralId");
            CreateIndex("MT.InformeTecnicoFinal", "ITFgeneralId");
            AddForeignKey("MT.InformeTecnicoFinal", "ITFgeneralId", "MT.InformeTFgeneral", "ITFgeneralId");
            AddForeignKey("MT.AdjuntoITF", "ITFgeneralId", "MT.InformeTFgeneral", "ITFgeneralId");
        }
    }
}
